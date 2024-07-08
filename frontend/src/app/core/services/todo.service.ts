import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { IResponse, ITodo } from '../models/todo.model';
import { HttpClient } from '@angular/common/http';
import { apiEndpoint } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private http: HttpClient) {}

  getAllTodo(status: string): Observable<IResponse<ITodo[]>> {
    let queryString = '';
    if (status !== '') {
      queryString = `?status=${status}`;
    }
    const url = `${apiEndpoint.TodoEndpoint.getAllTodo}${queryString}`;
    console.log('Fetching todos from:', url); // Log the URL being called
    return this.http.get<IResponse<ITodo[]>>(url).pipe(
      tap(response => console.log('Todos fetched:', response)), // Log the response data
      catchError(error => {
        console.error('Error fetching todos:', error); // Log any errors
        throw error; // Rethrow the error to be handled by the caller
      })
    );
  }

  addTodo(data: ITodo): Observable<IResponse<ITodo>> {
    return this.http.post<IResponse<ITodo>>(
      `${apiEndpoint.TodoEndpoint.addTodo}`,
      data
    );
  }

  updateTodo(id: string, data: ITodo): Observable<IResponse<ITodo>> {
    return this.http.put<IResponse<ITodo>>(
      `${apiEndpoint.TodoEndpoint.updateTodo}/${id}`,
      data
    );
  }
}