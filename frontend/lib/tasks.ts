// lib/tasks.ts
import { Task, TaskData } from './types';
import apiClient from './api';

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await apiClient.get('/api/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (taskData: TaskData): Promise<Task> => {
  try {
    const response = await apiClient.post('/api/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (id: number, taskData: Partial<TaskData>): Promise<Task> => {
  try {
    const response = await apiClient.put(`/api/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/tasks/${id}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};