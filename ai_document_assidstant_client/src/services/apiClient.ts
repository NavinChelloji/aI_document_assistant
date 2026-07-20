import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create a base Axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9000',
  // This is crucial for HttpOnly cookies. It tells the browser to include
  // cookies in cross-origin requests.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Because we are relying on HttpOnly cookies, we do NOT need to manually
    // attach an Authorization header from localStorage here. 
    // The browser automatically attaches the HttpOnly cookie for us.
    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error.message);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // If the backend returns a wrapped StandardResponse { success: true, message: ..., data: ... }
    if (response.data && response.data.success !== undefined && 'data' in response.data) {
      // Return the inner data to keep service functions clean
      response.data = response.data.data;
    }
    return response;
  },
  (error: AxiosError) => {
    // Check if the request was cancelled
    if (axios.isCancel(error)) {
      console.log('[API Request Cancelled]:', error.message);
    } else {
      // Global error logging
      console.error(
        `[API Response Error] ${error.response?.status || 'Network'} - ${
          error.config?.url
        }:`,
        error.response?.data || error.message
      );

      // Handle specific status codes (e.g., 401 Unauthorized)
      if (error.response?.status === 401) {
        // e.g., trigger a redirect to login or show a session expired toast
        console.warn('Unauthorized access. User may need to log in again.');
        // window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);
