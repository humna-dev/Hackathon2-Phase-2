// lib/tasks.ts
import { Task, TaskData } from './types';
import { getAuthToken, logout } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Get the token from localStorage
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 401) {
      // Unauthorized - token might be expired
      logout();
      window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    } else {
      throw new Error('Failed to fetch tasks');
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (taskData: TaskData): Promise<Task> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 401) {
      logout();
      window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    } else {
      throw new Error('Failed to create task');
    }
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (id: number, taskData: Partial<TaskData>): Promise<Task> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 401) {
      logout();
      window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    } else if (response.status === 404) {
      throw new Error('Task not found');
    } else {
      throw new Error('Failed to update task');
    }
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        window.location.href = '/auth/login';
        throw new Error('Unauthorized');
      } else if (response.status === 404) {
        throw new Error('Task not found');
      } else {
        throw new Error('Failed to delete task');
      }
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};