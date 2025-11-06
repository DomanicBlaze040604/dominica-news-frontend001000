import { useState, useCallback, useRef } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  progress?: number;
}

interface UseLoadingStateOptions {
  initialLoading?: boolean;
  timeout?: number;
  onTimeout?: () => void;
}

export const useLoadingState = (options: UseLoadingStateOptions = {}) => {
  const { initialLoading = false, timeout, onTimeout } = options;
  
  const [state, setState] = useState<LoadingState>({
    isLoading: initialLoading,
    error: null,
    progress: undefined
  });
  
  const timeoutRef = useRef<number>();
  
  const setLoading = useCallback((loading: boolean, message?: string) => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
      error: loading ? null : prev.error
    }));
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set timeout if loading and timeout is specified
    if (loading && timeout) {
      timeoutRef.current = setTimeout(() => {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: message || 'Operation timed out'
        }));
        onTimeout?.();
      }, timeout);
    }
  }, [timeout, onTimeout]);
  
  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false
    }));
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);
  
  const setProgress = useCallback((progress: number) => {
    setState(prev => ({
      ...prev,
      progress: Math.max(0, Math.min(100, progress))
    }));
  }, []);
  
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      progress: undefined
    });
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);
  
  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T | null> => {
    try {
      setLoading(true, loadingMessage);
      const result = await asyncFn();
      setLoading(false);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      return null;
    }
  }, [setLoading, setError]);
  
  return {
    ...state,
    setLoading,
    setError,
    setProgress,
    reset,
    executeAsync
  };
};

// Hook for managing multiple loading states
export const useMultipleLoadingStates = () => {
  const [states, setStates] = useState<Record<string, LoadingState>>({});
  
  const setLoading = useCallback((key: string, loading: boolean) => {
    setStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isLoading: loading,
        error: loading ? null : prev[key]?.error || null
      }
    }));
  }, []);
  
  const setError = useCallback((key: string, error: string | null) => {
    setStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        error,
        isLoading: false
      }
    }));
  }, []);
  
  const setProgress = useCallback((key: string, progress: number) => {
    setStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        progress: Math.max(0, Math.min(100, progress))
      }
    }));
  }, []);
  
  const getState = useCallback((key: string): LoadingState => {
    return states[key] || { isLoading: false, error: null };
  }, [states]);
  
  const isAnyLoading = useCallback(() => {
    return Object.values(states).some(state => state.isLoading);
  }, [states]);
  
  const hasAnyError = useCallback(() => {
    return Object.values(states).some(state => state.error);
  }, [states]);
  
  const reset = useCallback((key?: string) => {
    if (key) {
      setStates(prev => ({
        ...prev,
        [key]: { isLoading: false, error: null }
      }));
    } else {
      setStates({});
    }
  }, []);
  
  return {
    states,
    setLoading,
    setError,
    setProgress,
    getState,
    isAnyLoading,
    hasAnyError,
    reset
  };
};