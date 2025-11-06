import { useState, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number) => void;
  onMaxAttemptsReached?: () => void;
}

interface RetryState {
  isRetrying: boolean;
  attempts: number;
  lastError: unknown;
}

export const useRetry = (options: RetryOptions = {}) => {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    onRetry,
    onMaxAttemptsReached
  } = options;

  const [retryState, setRetryState] = useState<RetryState>({
    isRetrying: false,
    attempts: 0,
    lastError: null
  });

  const { handleError } = useErrorHandler();

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    customOptions?: Partial<RetryOptions>
  ): Promise<T> => {
    const finalOptions = { ...options, ...customOptions };
    const finalMaxAttempts = finalOptions.maxAttempts || maxAttempts;
    const finalDelay = finalOptions.delay || delay;
    const finalBackoff = finalOptions.backoff !== undefined ? finalOptions.backoff : backoff;

    let lastError: unknown;
    
    for (let attempt = 1; attempt <= finalMaxAttempts; attempt++) {
      try {
        setRetryState({
          isRetrying: attempt > 1,
          attempts: attempt,
          lastError: null
        });

        const result = await operation();
        
        // Reset state on success
        setRetryState({
          isRetrying: false,
          attempts: 0,
          lastError: null
        });

        return result;
      } catch (error) {
        lastError = error;
        
        setRetryState({
          isRetrying: true,
          attempts: attempt,
          lastError: error
        });

        // If this is the last attempt, don't retry
        if (attempt === finalMaxAttempts) {
          if (finalOptions.onMaxAttemptsReached || onMaxAttemptsReached) {
            (finalOptions.onMaxAttemptsReached || onMaxAttemptsReached)!();
          }
          break;
        }

        // Call retry callback
        if (finalOptions.onRetry || onRetry) {
          (finalOptions.onRetry || onRetry)!(attempt);
        }

        // Calculate delay with optional backoff
        const currentDelay = finalBackoff 
          ? finalDelay * Math.pow(2, attempt - 1) 
          : finalDelay;

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
    }

    // All attempts failed
    setRetryState({
      isRetrying: false,
      attempts: finalMaxAttempts,
      lastError
    });

    throw lastError;
  }, [maxAttempts, delay, backoff, onRetry, onMaxAttemptsReached, options]);

  const retry = useCallback(async <T>(operation: () => Promise<T>) => {
    try {
      return await executeWithRetry(operation);
    } catch (error) {
      handleError(error, {
        fallbackMessage: `Operation failed after ${retryState.attempts} attempts`
      });
      throw error;
    }
  }, [executeWithRetry, handleError, retryState.attempts]);

  const reset = useCallback(() => {
    setRetryState({
      isRetrying: false,
      attempts: 0,
      lastError: null
    });
  }, []);

  return {
    executeWithRetry,
    retry,
    reset,
    ...retryState
  };
};