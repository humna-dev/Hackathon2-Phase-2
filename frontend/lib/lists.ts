// lib/lists.ts
import { TaskList, TaskListData } from './types';
import apiClient from './api';

export const getLists = async (): Promise<TaskList[]> => {
  try {
    const response = await apiClient.get('/api/lists');
    return response.data;
  } catch (error) {
    console.error('Error fetching lists:', error);
    throw error;
  }
};

export const createList = async (listData: TaskListData): Promise<TaskList> => {
  try {
    const response = await apiClient.post('/api/lists', listData);
    return response.data;
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

export const deleteList = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/lists/${id}`);
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
};