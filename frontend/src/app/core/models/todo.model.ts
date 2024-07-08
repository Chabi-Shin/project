import { ITodoType } from "../../shared/components/todo-card/todo-card.component";

// todo.model.ts
export interface IResponse<T> {
  data: T;
  message?: string;
}

export interface ITodo {
  id?: string; // Add the `id` property
  _id?: string; // Add the `_id` property for MongoDB
  title: string;
  description: string;
  status: ITodoType;
  created_at?: string;
  updated_at?: string;
}