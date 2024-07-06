import { Component, OnInit } from '@angular/core';
import { ITodoStatus, TodoCardComponent } from '../../shared/components/todo-card/todo-card.component';
import { ITodo } from '../../core/models/todo.model';
import { TodoService } from '../../core/services/todo.service';
import { SlidePanelComponent } from '../../shared/ui/slide-panel/slide-panel.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, NgIf, TodoCardComponent, SlidePanelComponent, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  todoForm!: FormGroup;
  todos: ITodo[] = [];
  filteredTodos: ITodo[] = [];
  todoStatus = ITodoStatus;
  isSlidePanelOpen = false;
  todoId: string | null = null;  // Use string type for MongoDB ObjectId
  filterStatus: string = 'ALL';

  constructor(private todoService: TodoService, private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('OPEN', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getAllTodos();
  }

  getAllTodos() {
    this.todoService.getAllTodo().subscribe({
      next: (data) => {
        this.todos = data;
        this.applyFilter();
      },
      error: (error) => console.error('Error fetching todos:', error),
    });
  }

  applyFilter() {
    if (this.filterStatus === 'ALL') {
      this.filteredTodos = this.todos;
    } else {
      this.filteredTodos = this.todos.filter(todo => todo.status === this.filterStatus);
    }
  }

  openSlidePanel() {
    this.isSlidePanelOpen = true;
  }

  onCloseSlidePanel() {
    this.isSlidePanelOpen = false;
    this.todoForm.reset();
    this.todoId = null;
  }

  onSubmit() {
    if (this.todoForm.valid) {
      if (this.todoId) {
        // Update existing todo
        this.todoService.updateTodo(this.todoId, this.todoForm.value).subscribe({
          next: () => {
            this.getAllTodos();
            this.onCloseSlidePanel();
          },
        });
      } else {
        // Add new todo
        const newTodo: ITodo = {
          ...this.todoForm.value,
          created_at: new Date().toISOString(),
          updated_at: null
        };
        this.todoService.addTodo(newTodo).subscribe({
          next: () => {
            this.getAllTodos();
            this.onCloseSlidePanel();
          },
        });
      }
    } else {
      this.todoForm.markAllAsTouched();
    }
  }


  onLoadTodoForm(item: ITodo) {
    this.todoId = item.id; // Ensure this is the MongoDB ObjectId
    this.todoForm.patchValue({
      title: item.title,
      description: item.description,
      status: item.status,
    });
    this.openSlidePanel();
  }

  trackByFn(index: number, item: ITodo): string {
    return item.id; // Use MongoDB ObjectId
  }

  setFilterStatus(status: string) {
    this.filterStatus = status;
    this.applyFilter();
  }
}
