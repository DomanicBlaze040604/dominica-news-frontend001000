/**
 * Error Prevention Utilities
 * Prevents cascading errors and toast spam when backend is experiencing issues
 */

interface ErrorTracker {
  count: number;
  lastOccurrence: number;
  suppressed: boolean;
}

class ErrorPreventionService {
  private errorTrackers = new Map<string, ErrorTracker>();
  private readonly ERROR_THRESHOLD = 1; // Max errors per type before suppression (reduced from 3)
  private readonly SUPPRESSION_WINDOW = 30000; // 30 seconds (reduced from 1 minute)
  private readonly RESET_WINDOW = 120000; // 2 minutes (reduced from 5 minutes)

  /**
   * Check if an error should be suppressed to prevent spam
   */
  shouldSuppressError(errorType: string, errorMessage: string): boolean {
    const key = `${errorType}:${errorMessage}`;
    const now = Date.now();
    
    let tracker = this.errorTrackers.get(key);
    
    if (!tracker) {
      tracker = { count: 0, lastOccurrence: 0, suppressed: false };
      this.errorTrackers.set(key, tracker);
    }

    // Reset tracker if enough time has passed
    if (now - tracker.lastOccurrence > this.RESET_WINDOW) {
      tracker.count = 0;
      tracker.suppressed = false;
    }

    tracker.count++;
    tracker.lastOccurrence = now;

    // Suppress if we've hit the threshold
    if (tracker.count >= this.ERROR_THRESHOLD) {
      if (!tracker.suppressed) {
        tracker.suppressed = true;
        console.warn(`Error suppressed due to frequency: ${key}`);
        return false; // Allow this one last error to show suppression message
      }
      return true; // Suppress subsequent errors
    }

    return false;
  }

  /**
   * Clean up old error trackers
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, tracker] of this.errorTrackers.entries()) {
      if (now - tracker.lastOccurrence > this.RESET_WINDOW) {
        this.errorTrackers.delete(key);
      }
    }
  }

  /**
   * Check if backend is likely down based on error patterns
   */
  isBackendLikelyDown(): boolean {
    const now = Date.now();
    let recentNetworkErrors = 0;
    let recentServerErrors = 0;

    for (const [key, tracker] of this.errorTrackers.entries()) {
      if (now - tracker.lastOccurrence < this.SUPPRESSION_WINDOW) {
        if (key.includes('Network') || key.includes('fetch')) {
          recentNetworkErrors += tracker.count;
        }
        if (key.includes('500') || key.includes('Server')) {
          recentServerErrors += tracker.count;
        }
      }
    }

    return recentNetworkErrors >= 3 || recentServerErrors >= 3;
  }

  /**
   * Get a user-friendly message when backend is down
   */
  getBackendDownMessage(): string {
    return 'Our servers are temporarily experiencing issues. We\'re working to resolve this quickly. Please try again in a few minutes.';
  }

  /**
   * Reset all error tracking (useful for testing or manual reset)
   */
  reset(): void {
    this.errorTrackers.clear();
  }
}

// Create singleton instance
const errorPrevention = new ErrorPreventionService();

// Clean up old trackers every 5 minutes
setInterval(() => {
  errorPrevention.cleanup();
}, 300000);

export default errorPrevention;

/**
 * Utility function to safely handle API calls with fallback data
 */
export const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  fallbackData: T,
  errorContext?: string
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    const errorType = error instanceof Error ? error.constructor.name : 'UnknownError';
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if we should suppress this error
    if (errorPrevention.shouldSuppressError(errorType, errorMessage)) {
      console.warn(`Suppressed error in ${errorContext}:`, errorMessage);
      return fallbackData;
    }

    // If backend is likely down, use fallback data silently
    if (errorPrevention.isBackendLikelyDown()) {
      console.warn(`Backend appears to be down, using fallback data for ${errorContext}`);
      return fallbackData;
    }

    // Re-throw error if not suppressed
    throw error;
  }
};

/**
 * Utility to create fallback data for common API responses
 */
export const createFallbackData = {
  articles: () => ({
    data: {
      articles: [],
      pagination: { 
        currentPage: 1, 
        totalPages: 0, 
        hasNextPage: false, 
        hasPrevPage: false,
        limit: 10,
        totalArticles: 0
      }
    },
    success: true,
    message: 'Using cached data'
  }),

  categories: () => ({
    data: {
      categories: [
        { 
          id: '1', 
          name: 'World', 
          slug: 'world', 
          description: 'International news',
          displayOrder: 1,
          articleCount: 0,
          createdAt: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Dominica', 
          slug: 'dominica', 
          description: 'Local news',
          displayOrder: 2,
          articleCount: 0,
          createdAt: new Date().toISOString()
        },
        { 
          id: '3', 
          name: 'Economy', 
          slug: 'economy', 
          description: 'Economic news',
          displayOrder: 3,
          articleCount: 0,
          createdAt: new Date().toISOString()
        },
        { 
          id: '4', 
          name: 'Agriculture', 
          slug: 'agriculture', 
          description: 'Agricultural news',
          displayOrder: 4,
          articleCount: 0,
          createdAt: new Date().toISOString()
        }
      ],
      count: 4
    },
    success: true,
    message: 'Using default categories'
  }),

  authors: () => ({
    data: {
      authors: []
    },
    success: true,
    message: 'Using cached data'
  }),

  breakingNews: () => ({
    data: {
      breakingNews: []
    },
    success: true,
    message: 'No breaking news available'
  }),

  settings: () => ({
    data: {
      siteName: 'Dominica News',
      siteDescription: 'Your source for news from the Nature Island',
      contactEmail: 'info@dominicanews.com',
      socialMedia: {}
    },
    success: true,
    message: 'Using default settings'
  })
};