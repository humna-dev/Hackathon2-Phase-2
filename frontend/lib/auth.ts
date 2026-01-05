// lib/auth.ts
import { LoginCredentials, RegisterData } from './types';
import apiClient from './api';

export const authenticateUser = async (
  username: string,
  password: string
): Promise<{ success: boolean; message?: string; token?: string }> => {
  try {
    const response = await apiClient.post('/api/auth/login', {
      username,
      password,
    });

    if (response.data.access_token) {
      // Store the JWT token in both localStorage and cookie for proper middleware handling
      localStorage.setItem('token', response.data.access_token);
      document.cookie = `token=${response.data.access_token}; path=/; max-age=3600; SameSite=Strict`;
      return { success: true, token: response.data.access_token };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  } catch (error: any) {
    let errorMessage = 'Invalid credentials';

    if (error.response?.data) {
      const errorData = error.response.data;
      try {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = String(errorData.detail);
        } else if (Array.isArray(errorData) && errorData[0]?.msg) {
          errorMessage = String(errorData[0].msg);
        } else if (errorData.msg) {
          errorMessage = String(errorData.msg);
        }
      } catch {
        errorMessage = 'Invalid credentials';
      }
    }

    console.error('Login error:', error);
    return { success: false, message: errorMessage };
  }
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.post('/api/auth/register', {
      username,
      email,
      password,
    });

    if (response.status === 201) {
      return { success: true };
    } else {
      return { success: false, message: 'Registration failed' };
    }
  } catch (error: any) {
    let errorMessage = 'Registration failed';

    if (error.response?.data) {
      const errorData = error.response.data;
      try {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = String(errorData.detail);
        } else if (Array.isArray(errorData) && errorData[0]?.msg) {
          errorMessage = String(errorData[0].msg);
        } else if (errorData.msg) {
          errorMessage = String(errorData.msg);
        }
      } catch {
        errorMessage = 'Registration failed';
      }
    }

    console.error('Registration error:', error);
    return { success: false, message: errorMessage };
  }
};

export const logout = async () => {
  // Call backend logout if token exists
  try {
    await apiClient.post('/api/auth/logout');
  } catch (error) {
    console.log('Backend logout failed:', error);
    // Continue with local logout even if backend fails
  }

  // Always clear local storage and cookie
  localStorage.removeItem('token');
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
};

export const isAuthenticated = (): boolean => {
  // Check both localStorage and cookie for token
  const token = localStorage.getItem('token') || getCookie('token');
  if (!token) return false;

  // Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (e) {
    return false;
  }
};

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

