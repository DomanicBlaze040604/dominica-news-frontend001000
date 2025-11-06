/**
 * Performance Monitoring System
 * Comprehensive monitoring for loading times, user interactions, and Core Web Vitals
 */

interface PerformanceMetrics {
  // Core Web Vitals
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  
  // Navigation timing
  domContentLoaded: number;
  loadComplete: number;
  timeToInteractive: number;
  
  // Resource timing
  totalResources: number;
  totalTransferSize: number;
  
  // Custom metrics
  fontLoadTime: number;
  imageLoadTime: number;
  apiResponseTime: number;
  
  // User interaction metrics
  clickResponseTime: number;
  scrollPerformance: number;
  
  // Memory usage
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private startTime = performance.now(); // Used for tracking session duration
  private interactionTimes: number[] = [];
  private apiTimes: Map<string, number> = new Map();

  constructor() {
    this.initializeObservers();
    this.setupEventListeners();
  }

  /**
   * Initialize performance observers
   */
  private initializeObservers() {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    // First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.metrics.firstContentfulPaint = fcpEntry.startTime;
          this.logMetric('First Contentful Paint', fcpEntry.startTime);
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    } catch (e) {
      console.warn('FCP observer failed:', e);
    }

    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
        this.logMetric('Largest Contentful Paint', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observer failed:', e);
    }

    // Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        }
        this.metrics.cumulativeLayoutShift = clsValue;
        this.logMetric('Cumulative Layout Shift', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS observer failed:', e);
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any;
          const fid = fidEntry.processingStart - entry.startTime;
          this.metrics.firstInputDelay = fid;
          this.logMetric('First Input Delay', fid);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID observer failed:', e);
    }

    // Resource timing
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let totalSize = 0;
        let fontLoadTime = 0;
        let imageLoadTime = 0;

        entries.forEach((entry: any) => {
          totalSize += entry.transferSize || 0;
          
          if (entry.name.includes('font')) {
            fontLoadTime = Math.max(fontLoadTime, entry.responseEnd - entry.startTime);
          }
          
          if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            imageLoadTime = Math.max(imageLoadTime, entry.responseEnd - entry.startTime);
          }
        });

        this.metrics.totalTransferSize = (this.metrics.totalTransferSize || 0) + totalSize;
        this.metrics.fontLoadTime = Math.max(this.metrics.fontLoadTime || 0, fontLoadTime);
        this.metrics.imageLoadTime = Math.max(this.metrics.imageLoadTime || 0, imageLoadTime);
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (e) {
      console.warn('Resource observer failed:', e);
    }
  }

  /**
   * Setup event listeners for user interaction monitoring
   */
  private setupEventListeners() {
    // Click response time monitoring
    document.addEventListener('click', () => {
      const startTime = performance.now();
      
      // Use requestAnimationFrame to measure response time
      requestAnimationFrame(() => {
        const responseTime = performance.now() - startTime;
        this.interactionTimes.push(responseTime);
        
        // Keep only last 10 interactions
        if (this.interactionTimes.length > 10) {
          this.interactionTimes.shift();
        }
        
        this.metrics.clickResponseTime = this.getAverageInteractionTime();
      });
    });

    // Scroll performance monitoring
    let scrollStartTime = 0;
    let scrollEndTime = 0;
    let scrollTimeout: number;

    document.addEventListener('scroll', () => {
      if (!scrollStartTime) {
        scrollStartTime = performance.now();
      }
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollEndTime = performance.now();
        const scrollDuration = scrollEndTime - scrollStartTime;
        this.metrics.scrollPerformance = scrollDuration;
        scrollStartTime = 0;
      }, 150);
    });

    // Page load completion
    window.addEventListener('load', () => {
      this.collectNavigationMetrics();
      this.collectMemoryMetrics();
      this.calculateTimeToInteractive();
    });
  }

  /**
   * Collect navigation timing metrics
   */
  private collectNavigationMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      this.metrics.loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
      this.metrics.totalResources = performance.getEntriesByType('resource').length;
    }
  }

  /**
   * Collect memory usage metrics
   */
  private collectMemoryMetrics() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
  }

  /**
   * Calculate Time to Interactive (TTI)
   */
  private calculateTimeToInteractive() {
    // Simplified TTI calculation
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.metrics.timeToInteractive = navigation.domContentLoadedEventEnd;
    }
  }

  /**
   * Track API response times
   */
  trackApiCall(url: string, startTime: number, endTime: number) {
    const responseTime = endTime - startTime;
    this.apiTimes.set(url, responseTime);
    
    // Calculate average API response time
    const times = Array.from(this.apiTimes.values());
    this.metrics.apiResponseTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    
    this.logMetric(`API Response Time (${url})`, responseTime);
  }

  /**
   * Get average interaction time
   */
  private getAverageInteractionTime(): number {
    if (this.interactionTimes.length === 0) return 0;
    return this.interactionTimes.reduce((sum, time) => sum + time, 0) / this.interactionTimes.length;
  }

  /**
   * Log performance metric
   */
  private logMetric(name: string, value: number) {
    if (import.meta.env.MODE === 'development') {
      console.log(`📊 ${name}: ${value.toFixed(2)}ms`);
    }
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): PerformanceMetrics {
    return this.metrics as PerformanceMetrics;
  }

  /**
   * Get performance score based on Core Web Vitals
   */
  getPerformanceScore(): { score: number; grade: string; recommendations: string[] } {
    const metrics = this.getMetrics();
    let score = 100;
    const recommendations: string[] = [];

    // FCP scoring (good: <1.8s, needs improvement: 1.8s-3s, poor: >3s)
    if (metrics.firstContentfulPaint > 3000) {
      score -= 20;
      recommendations.push('Improve First Contentful Paint (currently > 3s)');
    } else if (metrics.firstContentfulPaint > 1800) {
      score -= 10;
      recommendations.push('Optimize First Contentful Paint (currently > 1.8s)');
    }

    // LCP scoring (good: <2.5s, needs improvement: 2.5s-4s, poor: >4s)
    if (metrics.largestContentfulPaint > 4000) {
      score -= 25;
      recommendations.push('Improve Largest Contentful Paint (currently > 4s)');
    } else if (metrics.largestContentfulPaint > 2500) {
      score -= 15;
      recommendations.push('Optimize Largest Contentful Paint (currently > 2.5s)');
    }

    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (metrics.cumulativeLayoutShift > 0.25) {
      score -= 20;
      recommendations.push('Reduce Cumulative Layout Shift (currently > 0.25)');
    } else if (metrics.cumulativeLayoutShift > 0.1) {
      score -= 10;
      recommendations.push('Optimize Cumulative Layout Shift (currently > 0.1)');
    }

    // FID scoring (good: <100ms, needs improvement: 100ms-300ms, poor: >300ms)
    if (metrics.firstInputDelay > 300) {
      score -= 20;
      recommendations.push('Improve First Input Delay (currently > 300ms)');
    } else if (metrics.firstInputDelay > 100) {
      score -= 10;
      recommendations.push('Optimize First Input Delay (currently > 100ms)');
    }

    let grade = 'A';
    if (score < 90) grade = 'B';
    if (score < 80) grade = 'C';
    if (score < 70) grade = 'D';
    if (score < 60) grade = 'F';

    return { score: Math.max(0, score), grade, recommendations };
  }

  /**
   * Generate performance report
   */
  generateReport(): void {
    if (import.meta.env.MODE !== 'development') return;

    const metrics = this.getMetrics();
    const { score, grade, recommendations } = this.getPerformanceScore();

    console.group('🚀 Performance Monitoring Report');
    
    console.log('Core Web Vitals:', {
      'First Contentful Paint': `${(metrics.firstContentfulPaint || 0).toFixed(2)}ms`,
      'Largest Contentful Paint': `${(metrics.largestContentfulPaint || 0).toFixed(2)}ms`,
      'Cumulative Layout Shift': (metrics.cumulativeLayoutShift || 0).toFixed(3),
      'First Input Delay': `${(metrics.firstInputDelay || 0).toFixed(2)}ms`
    });

    console.log('Loading Performance:', {
      'DOM Content Loaded': `${(metrics.domContentLoaded || 0).toFixed(2)}ms`,
      'Load Complete': `${(metrics.loadComplete || 0).toFixed(2)}ms`,
      'Time to Interactive': `${(metrics.timeToInteractive || 0).toFixed(2)}ms`,
      'Font Load Time': `${(metrics.fontLoadTime || 0).toFixed(2)}ms`,
      'Image Load Time': `${(metrics.imageLoadTime || 0).toFixed(2)}ms`
    });

    console.log('User Interaction:', {
      'Average Click Response': `${(metrics.clickResponseTime || 0).toFixed(2)}ms`,
      'Scroll Performance': `${(metrics.scrollPerformance || 0).toFixed(2)}ms`,
      'Average API Response': `${(metrics.apiResponseTime || 0).toFixed(2)}ms`
    });

    if (metrics.memoryUsage) {
      console.log('Memory Usage:', {
        'Used Heap': `${(metrics.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        'Total Heap': `${(metrics.memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        'Heap Limit': `${(metrics.memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      });
    }

    console.log(`Performance Score: ${score}/100 (Grade: ${grade})`);
    
    if (recommendations.length > 0) {
      console.log('Recommendations:', recommendations);
    }

    console.groupEnd();
  }

  /**
   * Cleanup observers
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook for React components to access performance metrics
 */
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = React.useState<Partial<PerformanceMetrics>>({});

  React.useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

/**
 * API call tracking wrapper
 */
export const trackApiCall = async <T>(
  url: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const endTime = performance.now();
    performanceMonitor.trackApiCall(url, startTime, endTime);
    return result;
  } catch (error) {
    const endTime = performance.now();
    performanceMonitor.trackApiCall(url, startTime, endTime);
    throw error;
  }
};

// Add React import
import React from 'react';