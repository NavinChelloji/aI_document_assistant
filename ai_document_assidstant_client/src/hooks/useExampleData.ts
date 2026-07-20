import { useState, useEffect } from 'react';
import { exampleService } from '../services/exampleService';

/**
 * Example Hook showing manual AbortController usage.
 * NOTE: If you are using @tanstack/react-query, you don't need this manual hook.
 * React Query handles the AbortController lifecycle automatically.
 */
export function useExampleData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 1. Create an AbortController instance
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        // 2. Pass the signal to the service
        const result = await exampleService.getData(abortController.signal);
        setData(result);
      } catch (err: any) {
        // 3. Ignore errors caused by cancellation
        if (err.name === 'CanceledError') {
          console.log('Request was cancelled safely.');
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 4. Cleanup function runs when component unmounts
    return () => {
      abortController.abort();
    };
  }, []);

  return { data, loading, error };
}
