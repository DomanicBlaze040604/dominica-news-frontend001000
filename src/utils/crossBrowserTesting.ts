/**
 * Cross-Browser Testing Utilities
 * Provides tools for testing features across different browsers and devices
 */

interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  mobile: boolean;
  supported: boolean;
}

interface FeatureSupport {
  feature: string;
  supported: boolean;
  fallback?: string;
  polyfillNeeded?: boolean;
}

interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
}

/**
 * Detect browser information
 */
export const detectBrowser = (): BrowserInfo => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  
  let name = 'Unknown';
  let version = 'Unknown';
  let engine = 'Unknown';
  let mobile = false;

  // Detect mobile
  mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  // Detect browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    name = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Blink';
  } else if (userAgent.includes('Firefox')) {
    name = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Gecko';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'WebKit';
  } else if (userAgent.includes('Edg')) {
    name = 'Edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Blink';
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    name = 'Internet Explorer';
    const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Trident';
  }

  // Determine if browser is supported
  const supported = isSupported(name, parseInt(version));

  return {
    name,
    version,
    engine,
    platform,
    mobile,
    supported
  };
};

/**
 * Check if browser version is supported
 */
const isSupported = (browser: string, version: number): boolean => {
  const minimumVersions: Record<string, number> = {
    'Chrome': 80,
    'Firefox': 75,
    'Safari': 13,
    'Edge': 80,
    'Internet Explorer': 0 // Not supported
  };

  return version >= (minimumVersions[browser] || 0);
};

/**
 * Test feature support across browsers
 */
export const testFeatureSupport = (): FeatureSupport[] => {
  const features: FeatureSupport[] = [];

  // CSS Features
  features.push({
    feature: 'CSS Grid',
    supported: CSS.supports('display', 'grid'),
    fallback: 'Flexbox layout'
  });

  features.push({
    feature: 'CSS Custom Properties',
    supported: CSS.supports('--test', 'value'),
    fallback: 'Static CSS values'
  });

  features.push({
    feature: 'CSS Flexbox',
    supported: CSS.supports('display', 'flex'),
    fallback: 'Float-based layout'
  });

  features.push({
    feature: 'CSS Transforms',
    supported: CSS.supports('transform', 'translateX(0)'),
    fallback: 'Position-based animations'
  });

  // JavaScript Features
  features.push({
    feature: 'ES6 Modules',
    supported: 'noModule' in HTMLScriptElement.prototype,
    polyfillNeeded: true
  });

  features.push({
    feature: 'Intersection Observer',
    supported: 'IntersectionObserver' in window,
    polyfillNeeded: true,
    fallback: 'Scroll event listeners'
  });

  features.push({
    feature: 'Web Fonts',
    supported: 'fonts' in document,
    fallback: 'System fonts'
  });

  features.push({
    feature: 'Local Storage',
    supported: 'localStorage' in window,
    fallback: 'Session storage or cookies'
  });

  features.push({
    feature: 'Fetch API',
    supported: 'fetch' in window,
    polyfillNeeded: true,
    fallback: 'XMLHttpRequest'
  });

  features.push({
    feature: 'Performance Observer',
    supported: 'PerformanceObserver' in window,
    fallback: 'Basic performance timing'
  });

  return features;
};

/**
 * Responsive design testing breakpoints
 */
export const responsiveBreakpoints: ResponsiveBreakpoint[] = [
  { name: 'Mobile Small', minWidth: 320, maxWidth: 479 },
  { name: 'Mobile Large', minWidth: 480, maxWidth: 767 },
  { name: 'Tablet', minWidth: 768, maxWidth: 1023 },
  { name: 'Desktop Small', minWidth: 1024, maxWidth: 1279 },
  { name: 'Desktop Large', minWidth: 1280, maxWidth: 1535 },
  { name: 'Desktop XL', minWidth: 1536 }
];

/**
 * Test responsive behavior
 */
export const testResponsiveDesign = (): void => {
  if (import.meta.env.MODE !== 'development') return;

  console.group('📱 Responsive Design Testing');
  
  const currentWidth = window.innerWidth;
  const currentBreakpoint = responsiveBreakpoints.find(bp => 
    currentWidth >= bp.minWidth && (!bp.maxWidth || currentWidth <= bp.maxWidth)
  );

  console.log(`Current viewport: ${currentWidth}px (${currentBreakpoint?.name || 'Unknown'})`);
  
  // Test each breakpoint
  responsiveBreakpoints.forEach(breakpoint => {
    console.log(`${breakpoint.name}: ${breakpoint.minWidth}px${breakpoint.maxWidth ? ` - ${breakpoint.maxWidth}px` : '+'}`);
  });

  console.groupEnd();
};

/**
 * Test typography rendering across browsers
 */
export const testTypographyRendering = (): void => {
  if (import.meta.env.MODE !== 'development') return;

  const testElement = document.createElement('div');
  testElement.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    visibility: hidden;
  `;
  testElement.textContent = 'Test Typography';
  document.body.appendChild(testElement);

  const computedStyle = window.getComputedStyle(testElement);
  
  console.group('🔤 Typography Testing');
  console.log('Font Family:', computedStyle.fontFamily);
  console.log('Font Size:', computedStyle.fontSize);
  console.log('Line Height:', computedStyle.lineHeight);
  console.log('Font Weight:', computedStyle.fontWeight);
  console.groupEnd();

  document.body.removeChild(testElement);
};

/**
 * Test navigation dropdown functionality
 */
export const testNavigationDropdowns = (): void => {
  if (import.meta.env.MODE !== 'development') return;

  const dropdowns = document.querySelectorAll('[data-testid="category-dropdown"]');
  
  console.group('🧭 Navigation Testing');
  console.log(`Found ${dropdowns.length} dropdown menus`);
  
  dropdowns.forEach((dropdown, index) => {
    const trigger = dropdown.querySelector('[data-testid="dropdown-trigger"]');
    const content = dropdown.querySelector('[data-testid="dropdown-content"]');
    
    console.log(`Dropdown ${index + 1}:`, {
      hasTrigger: !!trigger,
      hasContent: !!content,
      isVisible: content ? !content.classList.contains('hidden') : false
    });
  });
  
  console.groupEnd();
};

/**
 * Test image loading and lazy loading
 */
export const testImageLoading = (): void => {
  if (import.meta.env.MODE !== 'development') return;

  const images = document.querySelectorAll('img');
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  console.group('🖼️ Image Loading Testing');
  console.log(`Total images: ${images.length}`);
  console.log(`Lazy loaded images: ${lazyImages.length}`);
  
  let loadedImages = 0;
  let failedImages = 0;
  
  images.forEach((img, index) => {
    if (img.complete) {
      if (img.naturalWidth > 0) {
        loadedImages++;
      } else {
        failedImages++;
        console.warn(`Image ${index + 1} failed to load:`, img.src);
      }
    }
  });
  
  console.log(`Loaded: ${loadedImages}, Failed: ${failedImages}`);
  console.groupEnd();
};

/**
 * Test social media links
 */
export const testSocialMediaLinks = (): void => {
  if (import.meta.env.MODE !== 'development') return;

  const socialLinks = document.querySelectorAll('[data-testid="social-link"]');
  
  console.group('📱 Social Media Testing');
  console.log(`Found ${socialLinks.length} social media links`);
  
  socialLinks.forEach((link, index) => {
    const href = (link as HTMLAnchorElement).href;
    const target = (link as HTMLAnchorElement).target;
    
    console.log(`Link ${index + 1}:`, {
      href,
      target,
      opensInNewTab: target === '_blank'
    });
  });
  
  console.groupEnd();
};

/**
 * Comprehensive cross-browser test suite
 */
export const runCrossBrowserTests = (): void => {
  if (import.meta.env.MODE !== 'development') return;

  console.group('🌐 Cross-Browser Testing Suite');
  
  const browserInfo = detectBrowser();
  console.log('Browser Info:', browserInfo);
  
  if (!browserInfo.supported) {
    console.warn('⚠️ This browser version may not be fully supported');
  }
  
  const featureSupport = testFeatureSupport();
  console.log('Feature Support:', featureSupport);
  
  const unsupportedFeatures = featureSupport.filter(f => !f.supported);
  if (unsupportedFeatures.length > 0) {
    console.warn('Unsupported features:', unsupportedFeatures.map(f => f.feature));
  }
  
  // Run individual tests
  testResponsiveDesign();
  testTypographyRendering();
  
  // Delay DOM-dependent tests
  setTimeout(() => {
    testNavigationDropdowns();
    testImageLoading();
    testSocialMediaLinks();
  }, 1000);
  
  console.groupEnd();
};

/**
 * Generate browser compatibility report
 */
export const generateCompatibilityReport = (): void => {
  if (import.meta.env.MODE !== 'development') return;

  const browserInfo = detectBrowser();
  const featureSupport = testFeatureSupport();
  
  console.group('📊 Browser Compatibility Report');
  
  console.log('Environment:', {
    browser: `${browserInfo.name} ${browserInfo.version}`,
    engine: browserInfo.engine,
    platform: browserInfo.platform,
    mobile: browserInfo.mobile,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio
  });
  
  const supportedFeatures = featureSupport.filter(f => f.supported).length;
  const totalFeatures = featureSupport.length;
  const compatibilityScore = Math.round((supportedFeatures / totalFeatures) * 100);
  
  console.log(`Compatibility Score: ${compatibilityScore}% (${supportedFeatures}/${totalFeatures} features supported)`);
  
  const criticalUnsupported = featureSupport.filter(f => 
    !f.supported && !f.fallback && !f.polyfillNeeded
  );
  
  if (criticalUnsupported.length > 0) {
    console.warn('Critical unsupported features:', criticalUnsupported.map(f => f.feature));
  }
  
  console.groupEnd();
};