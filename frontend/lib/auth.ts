// lib/auth.ts
import { LoginCredentials, RegisterData } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const authenticateUser = async (
  username: string,
  password: string
): Promise<{ success: boolean; message?: string; token?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // Store the JWT token in localStorage
      localStorage.setItem('token', data.access_token);
      return { success: true, token: data.access_token };
    } else {
      const errorData = await response.json();
      let errorMessage = 'Invalid credentials';

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

      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Network error' };
  }
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      let errorMessage = 'Registration failed';

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

      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Network error' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
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

// Function to get JWT token for API calls
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};