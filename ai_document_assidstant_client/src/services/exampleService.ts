import { apiClient } from './apiClient';

/**
 * Example Service to demonstrate how to use AbortSignal for cancellation.
 * 
 * If you are using React Query, it will automatically pass an `AbortSignal` 
 * to your query functions when the component unmounts or the query is invalidated.
 * You just need to pass it down to Axios.
 */
export const exampleService = {
  /**
   * Fetches data with support for cancellation.
   * @param signal The AbortSignal from React Query or your own AbortController
   */
  getData: async (signal?: AbortSignal) => {
    const response = await apiClient.get('/api/example', {
      signal, // Pass the signal to axios config
    });
    return response.data;
  },

  /**
   * Example POST request
   */
  createData: async (data: any, signal?: AbortSignal) => {
    const response = await apiClient.post('/api/example', data, {
      signal,
    });
    return response.data;
  }
};
