// lib/lists.ts
import { TaskList, TaskListData } from './types';
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

export const getLists = async (): Promise<TaskList[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lists`, {
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
      throw new Error('Failed to fetch lists');
    }
  } catch (error) {
    console.error('Error fetching lists:', error);
    throw error;
  }
};

export const createList = async (listData: TaskListData): Promise<TaskList> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lists`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(listData),
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 401) {
      logout();
      window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    } else if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create list');
    } else {
      throw new Error('Failed to create list');
    }
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

export const deleteList = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lists/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        window.location.href = '/auth/login';
        throw new Error('Unauthorized');
      } else if (response.status === 404) {
        throw new Error('List not found');
      } else {
        throw new Error('Failed to delete list');
      }
    }
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
};