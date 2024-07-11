import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ITodoStatus, TodoCardComponent } from '../../shared/components/todo-card/todo-card.component';
import { TodoService } from '../../core/services/todo.service';
import { ITodo } from '../../core/models/todo.model';
import { SlidePanelComponent } from '../../shared/ui/slide-panel/slide-panel.component';
import { NotificationService } from '../../core/services/notifications.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, TodoCardComponent, SlidePanelComponent, ReactiveFormsModule], // Add CommonModule here
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit {
  todoForm!: FormGroup;
  todos: ITodo[] = [];
  todoStatus = ITodoStatus;
  isSlidePanelOpen = false;
  todoId: string | null = null;
  filterByStatus = '';
  message$ = this.notificationService.getMessage();

  constructor(private todoService: TodoService, private fb: FormBuilder, private notificationService: NotificationService) {
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
    this.todoService.getAllTodo(this.filterByStatus).subscribe({
      next: (response) => {
        this.todos = response.data;
      },
      error: (error) => {
        console.error('Error fetching todos:', error);
      }
    });
  }

  openSlidePanel() {
    this.isSlidePanelOpen = true;
  }

  onCloseSlidePanel() {
    this.isSlidePanelOpen = false;
    this.todoId = null;
    this.todoForm.reset({ status: 'OPEN' });
  }

  onFilterByStatus(status: string) {
    this.filterByStatus = status;
    this.getAllTodos();
  }

  onSubmit() {
    if (this.todoForm.valid) {
      if (this.todoId) {
        this.todoService.updateTodo(this.todoId, this.todoForm.value).subscribe({
          next: () => {
            this.getAllTodos();
            this.onCloseSlidePanel();
            this.notificationService.showMessage('Task updated');
          },
          error: (error) => {
            console.error('Error updating todo:', error);
          }
        });
      } else {
        this.todoService.addTodo(this.todoForm.value).subscribe({
          next: () => {
            this.getAllTodos();
            this.onCloseSlidePanel();
            this.notificationService.showMessage('Task created');
          },
          error: (error) => {
            console.error('Error adding todo:', error);
          }
        });
      }
    } else {
      this.todoForm.markAllAsTouched();
    }
  }

  confirmDelete() {
    const confirmed = window.confirm('Are you sure you want to delete this todo?');
    if (confirmed) {
      this.onDelete();
    }
  }

  onDelete() {
    if (this.todoId) {
      this.todoService.deleteTodo(this.todoId).subscribe({
        next: () => {
          this.getAllTodos();
          this.onCloseSlidePanel();
          this.notificationService.showMessage('Task deleted');
        },
        error: (error) => {
          console.error('Error deleting todo:', error);
        }
      });
    }
  }

  onLoadTodoForm(item: ITodo) {
    this.todoId = item.id!!;
    this.todoForm.patchValue({
      title: item.title,
      description: item.description,
      status: item.status,
    });
    this.openSlidePanel();
  }
}
