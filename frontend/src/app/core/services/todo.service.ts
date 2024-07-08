// todo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IResponse, ITodo } from '../models/todo.model';
import { apiEndpoint } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private baseUrl = 'http://localhost:8000/api/todo';
  constructor(private http: HttpClient) {}

  getAllTodo(status: string): Observable<IResponse<ITodo[]>> {
    let queryString = '';
    if (status !== '') {
      queryString = `?status=${status}`;
    }
    const url = `${apiEndpoint.TodoEndpoint.getAllTodo}${queryString}`;
    console.log('Fetching todos from:', url); // Log the URL being called
    return this.http.get<IResponse<ITodo[]>>(url).pipe(
      map(response => {
        // Map _id to id for all todos
        response.data = response.data.map(todo => {
          return { ...todo, id: todo._id };
        });
        return response;
      }),
      catchError(error => {
        console.error('Error fetching todos:', error);
        throw error;
      })
    );
  }

  addTodo(data: ITodo): Observable<IResponse<ITodo>> {
    return this.http.post<IResponse<ITodo>>(apiEndpoint.TodoEndpoint.addTodo, data);
  }

  deleteTodo(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateTodo(id: string, todo: ITodo): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, todo).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Error:', error);
    return throwError(error);
  }
}
