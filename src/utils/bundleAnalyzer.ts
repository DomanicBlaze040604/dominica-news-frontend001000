/**
 * Bundle Analysis Utilities
 * Provides tools for analyzing and optimizing bundle size
 */

interface BundleStats {
  totalScripts: number;
  totalStylesheets: number;
  estimatedSize: number;
  loadTime: number;
  scripts: Array<{
    src: string;
    size?: number;
    loadTime?: number;
  }>;
  stylesheets: Array<{
    href: string;
    size?: number;
    loadTime?: number;
  }>;
}

/**
 * Analyze current bundle composition and performance
 */
export const analyzeBundleComposition = async (): Promise<BundleStats> => {
  const scripts = Array.from(document.querySelectorAll('script[src]')) as HTMLScriptElement[];
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];

  const scriptStats = await Promise.all(
    scripts.map(async (script) => {
      const startTime = performance.now();
      try {
        const response = await fetch(script.src, { method: 'HEAD' });
        const size = parseInt(response.headers.get('content-length') || '0');
        const loadTime = performance.now() - startTime;
        return {
          src: script.src,
          size,
          loadTime
        };
      } catch {
        return {
          src: script.src,
          size: 0,
          loadTime: performance.now() - startTime
        };
      }
    })
  );

  const stylesheetStats = await Promise.all(
    stylesheets.map(async (stylesheet) => {
      const startTime = performance.now();
      try {
        const response = await fetch(stylesheet.href, { method: 'HEAD' });
        const size = parseInt(response.headers.get('content-length') || '0');
        const loadTime = performance.now() - startTime;
        return {
          href: stylesheet.href,
          size,
          loadTime
        };
      } catch {
        return {
          href: stylesheet.href,
          size: 0,
          loadTime: performance.now() - startTime
        };
      }
    })
  );

  const totalScriptSize = scriptStats.reduce((sum, stat) => sum + stat.size, 0);
  const totalStylesheetSize = stylesheetStats.reduce((sum, stat) => sum + stat.size, 0);
  const totalLoadTime = Math.max(
    ...scriptStats.map(s => s.loadTime),
    ...stylesheetStats.map(s => s.loadTime)
  );

  return {
    totalScripts: scripts.length,
    totalStylesheets: stylesheets.length,
    estimatedSize: totalScriptSize + totalStylesheetSize,
    loadTime: totalLoadTime,
    scripts: scriptStats,
    stylesheets: stylesheetStats
  };
};

/**
 * Performance metrics collection
 */
export const collectPerformanceMetrics = () => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');
  
  const metrics = {
    // Core Web Vitals
    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
    largestContentfulPaint: 0, // Will be updated by observer
    cumulativeLayoutShift: 0, // Will be updated by observer
    firstInputDelay: 0, // Will be updated by observer
    
    // Navigation timing
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    
    // Resource timing
    totalResources: performance.getEntriesByType('resource').length,
    
    // Memory (if available)
    memoryUsage: (performance as any).memory ? {
      usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
      totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
    } : null
  };

  return metrics;
};

/**
 * Set up Core Web Vitals monitoring
 */
export const setupCoreWebVitalsMonitoring = () => {
  // Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        console.log('CLS:', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported');
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('FID:', (entry as any).processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported');
    }
  }
};

/**
 * Bundle size recommendations
 */
export const getBundleOptimizationRecommendations = (stats: BundleStats) => {
  const recommendations: string[] = [];

  if (stats.estimatedSize > 1024 * 1024) { // > 1MB
    recommendations.push('Consider code splitting to reduce initial bundle size');
  }

  if (stats.totalScripts > 10) {
    recommendations.push('Consider bundling smaller scripts together');
  }

  if (stats.loadTime > 3000) { // > 3 seconds
    recommendations.push('Optimize resource loading with preloading and compression');
  }

  const largeScripts = stats.scripts.filter(s => s.size && s.size > 100 * 1024); // > 100KB
  if (largeScripts.length > 0) {
    recommendations.push(`Large scripts detected: ${largeScripts.map(s => s.src).join(', ')}`);
  }

  return recommendations;
};

/**
 * Resource loading optimization
 */
export const optimizeResourceLoading = () => {
  // Preload critical resources
  const criticalResources = [
    { href: '/src/main.tsx', as: 'script', type: 'text/javascript' },
    { href: '/src/index.css', as: 'style', type: 'text/css' }
  ];

  criticalResources.forEach(({ href, as, type }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  });

  // Prefetch non-critical resources
  const prefetchResources = [
    '/admin',
    '/category/world',
    '/category/dominica'
  ];

  prefetchResources.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  });
};

/**
 * Development bundle analysis report
 */
export const generateBundleReport = async () => {
  if (import.meta.env.MODE !== 'development') return;

  console.group('📦 Bundle Analysis Report');
  
  const stats = await analyzeBundleComposition();
  const metrics = collectPerformanceMetrics();
  const recommendations = getBundleOptimizationRecommendations(stats);

  console.log('Bundle Stats:', {
    totalScripts: stats.totalScripts,
    totalStylesheets: stats.totalStylesheets,
    estimatedSize: `${(stats.estimatedSize / 1024).toFixed(2)} KB`,
    loadTime: `${stats.loadTime.toFixed(2)} ms`
  });

  console.log('Performance Metrics:', {
    firstContentfulPaint: `${metrics.firstContentfulPaint.toFixed(2)} ms`,
    domContentLoaded: `${metrics.domContentLoaded.toFixed(2)} ms`,
    loadComplete: `${metrics.loadComplete.toFixed(2)} ms`,
    totalResources: metrics.totalResources
  });

  if (metrics.memoryUsage) {
    console.log('Memory Usage:', {
      used: `${(metrics.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      total: `${(metrics.memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      limit: `${(metrics.memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
    });
  }

  if (recommendations.length > 0) {
    console.log('Optimization Recommendations:', recommendations);
  }

  console.groupEnd();
};