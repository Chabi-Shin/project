import { Injectable } from '@angular/core';
import { IResponse, ITodo } from '../models/todo.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiEndpoint } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:8000/api/todos'; // API endpoint

  constructor(private http: HttpClient) { }

  getAllTodo(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(this.apiUrl);
  }

  addTodo(todo: ITodo): Observable<ITodo> {
    return this.http.post<ITodo>(this.apiUrl, todo);
  }

  updateTodo(id: string, data: ITodo): Observable<ITodo> {
    return this.http.put<ITodo>(`${this.apiUrl}/${id}`, data);
  }

  deleteTodoById(id: string): Observable<void> { // Change id type to string
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
