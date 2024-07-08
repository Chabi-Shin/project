import { Component, OnInit } from '@angular/core';
import {
  ITodoStatus,
  TodoCardComponent,
} from '../../shared/components/todo-card/todo-card.component';
import { TodoService } from '../../core/services/todo.service';
import { ITodo } from '../../core/models/todo.model';
import { SlidePanelComponent } from '../../shared/ui/slide-panel/slide-panel.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [TodoCardComponent, SlidePanelComponent, ReactiveFormsModule, NgFor, NgIf],
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
    this.todoService.getAllTodo(this.filterByStatus).subscribe({
      next: (response) => {
        console.log('Received todos:', response);
        this.todos = response.data; // Ensure this updates the component view
        // Manually trigger change detection if necessary
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
    this.todoId = null; // Reset todoId when closing
    this.todoForm.reset({ status: 'OPEN' }); // Reset form when closing
  }

  onFilterByStatus(status: string) {
    this.filterByStatus = status;
    this.getAllTodos();
  }


  onSubmit() {
    console.log('Form Submission', this.todoForm.value); // Log form data
    console.log('Current Todo ID:', this.todoId); // Log current todoId
  
    if (this.todoForm.valid) {
      if (this.todoId) {
        this.todoService.updateTodo(this.todoId, this.todoForm.value).subscribe({
          next: () => {
            this.getAllTodos();
            this.onCloseSlidePanel();
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
  
  onDelete() {
    console.log('Deleting todo with ID:', this.todoId); // Log the delete action
  
    if (this.todoId) {
      this.todoService.deleteTodo(this.todoId).subscribe({
        next: () => {
          this.getAllTodos();
          this.onCloseSlidePanel();
        },
        error: (error) => {
          console.error('Error deleting todo:', error);
        }
      });
    }
  }
  

  onLoadTodoForm(item: ITodo) {
    this.todoId = item.id!!; // Use id for MongoDB
    console.log('Loading todo with ID:', this.todoId); // Log the ID
    this.todoForm.patchValue({
      title: item.title,
      description: item.description,
      status: item.status,
    });
    this.openSlidePanel();
  }
}