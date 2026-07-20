import { useRef, useEffect, useCallback } from 'react';

export const useAbortController = () => {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get a fresh signal (aborts the previous one if it exists)
  const getSignal = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    return controller.signal;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { getSignal };
};
