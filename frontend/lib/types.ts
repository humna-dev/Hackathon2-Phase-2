// lib/types.ts
export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface TaskList {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string; // ISO date string
  list_id?: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface TaskData {
  title: string;
  description?: string;
  completed?: boolean;
  due_date?: string; // ISO date string
  list_id?: number;
}

export interface TaskListData {
  name: string;
}