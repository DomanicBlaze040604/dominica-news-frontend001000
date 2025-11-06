/**
 * Accessibility Testing Utilities
 * WCAG 2.1 AA compliance testing and accessibility auditing tools
 */

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  rule: string;
  description: string;
  element?: Element;
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriterion: string;
}

interface ColorContrastResult {
  ratio: number;
  level: 'AA' | 'AAA' | 'fail';
  foreground: string;
  background: string;
}

interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
  colorContrast: ColorContrastResult[];
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  semanticStructure: boolean;
  imageAccessibility: boolean;
  formAccessibility: boolean;
}

/**
 * Calculate color contrast ratio between two colors
 */
export const calculateContrastRatio = (foreground: string, background: string): number => {
  const getLuminance = (color: string): number => {
    // Convert color to RGB values
    const rgb = hexToRgb(color) || { r: 0, g: 0, b: 0 };
    
    // Convert to relative luminance
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;

    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Test color contrast compliance
 */
export const testColorContrast = (): ColorContrastResult[] => {
  const results: ColorContrastResult[] = [];
  const elements = document.querySelectorAll('*');

  elements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;

    // Skip elements without visible text or transparent backgrounds
    if (!color || backgroundColor === 'rgba(0, 0, 0, 0)' || !element.textContent?.trim()) {
      return;
    }

    try {
      const ratio = calculateContrastRatio(color, backgroundColor);
      let level: 'AA' | 'AAA' | 'fail' = 'fail';

      if (ratio >= 7) {
        level = 'AAA';
      } else if (ratio >= 4.5) {
        level = 'AA';
      }

      results.push({
        ratio,
        level,
        foreground: color,
        background: backgroundColor
      });
    } catch (error) {
      // Skip elements with invalid color values
    }
  });

  return results;
};

/**
 * Test keyboard navigation
 */
export const testKeyboardNavigation = (): boolean => {
  const focusableElements = document.querySelectorAll(
    'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );

  let hasProperTabOrder = true;
  let previousTabIndex = -1;

  focusableElements.forEach(element => {
    const tabIndex = parseInt(element.getAttribute('tabindex') || '0');
    
    // Check for proper tab order (should be sequential)
    if (tabIndex > 0 && tabIndex <= previousTabIndex) {
      hasProperTabOrder = false;
    }
    
    if (tabIndex > 0) {
      previousTabIndex = tabIndex;
    }
  });

  return hasProperTabOrder && focusableElements.length > 0;
};

/**
 * Test screen reader support
 */
export const testScreenReaderSupport = (): boolean => {
  const issues: string[] = [];

  // Check for proper heading structure
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let hasH1 = false;
  let previousLevel = 0;

  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    
    if (level === 1) {
      hasH1 = true;
    }
    
    // Check for proper heading hierarchy
    if (previousLevel > 0 && level > previousLevel + 1) {
      issues.push('Heading hierarchy skips levels');
    }
    
    previousLevel = level;
  });

  if (!hasH1) {
    issues.push('Missing H1 heading');
  }

  // Check for alt text on images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.getAttribute('alt')) {
      issues.push('Image missing alt text');
    }
  });

  // Check for ARIA labels on interactive elements
  const interactiveElements = document.querySelectorAll('button, input, select, textarea');
  interactiveElements.forEach(element => {
    const hasLabel = element.getAttribute('aria-label') || 
                    element.getAttribute('aria-labelledby') ||
                    document.querySelector(`label[for="${element.id}"]`);
    
    if (!hasLabel && !element.textContent?.trim()) {
      issues.push('Interactive element missing accessible name');
    }
  });

  return issues.length === 0;
};

/**
 * Test semantic HTML structure
 */
export const testSemanticStructure = (): boolean => {
  const issues: string[] = [];

  // Check for proper landmark elements
  const landmarks = {
    main: document.querySelectorAll('main').length,
    nav: document.querySelectorAll('nav').length,
    header: document.querySelectorAll('header').length,
    footer: document.querySelectorAll('footer').length
  };

  if (landmarks.main === 0) {
    issues.push('Missing main landmark');
  }

  if (landmarks.main > 1) {
    issues.push('Multiple main landmarks');
  }

  // Check for proper list structure
  const lists = document.querySelectorAll('ul, ol');
  lists.forEach(list => {
    const directChildren = Array.from(list.children);
    const hasNonListItems = directChildren.some(child => child.tagName !== 'LI');
    
    if (hasNonListItems) {
      issues.push('List contains non-list-item children');
    }
  });

  // Check for proper table structure
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const hasHeaders = table.querySelectorAll('th').length > 0;
    const hasCaption = table.querySelector('caption') !== null;
    
    if (!hasHeaders && !hasCaption) {
      issues.push('Table missing headers or caption');
    }
  });

  return issues.length === 0;
};

/**
 * Test image accessibility
 */
export const testImageAccessibility = (): boolean => {
  const issues: string[] = [];
  const images = document.querySelectorAll('img');

  images.forEach((img, index) => {
    const alt = img.getAttribute('alt');
    const src = img.getAttribute('src');

    // Check for alt attribute
    if (alt === null) {
      issues.push(`Image ${index + 1} missing alt attribute`);
    }

    // Check for empty alt on decorative images
    if (alt === '' && !img.getAttribute('role')) {
      // This might be decorative, which is okay
    }

    // Check for meaningful alt text
    if (alt && (alt.toLowerCase().includes('image') || alt.toLowerCase().includes('picture'))) {
      issues.push(`Image ${index + 1} has redundant alt text`);
    }

    // Check for loading attribute
    if (!img.getAttribute('loading')) {
      issues.push(`Image ${index + 1} missing loading attribute`);
    }

    // Check for broken images
    if (img.complete && img.naturalWidth === 0) {
      issues.push(`Image ${index + 1} failed to load`);
    }
  });

  return issues.length === 0;
};

/**
 * Test form accessibility
 */
export const testFormAccessibility = (): boolean => {
  const issues: string[] = [];
  const forms = document.querySelectorAll('form');

  forms.forEach((form, formIndex) => {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach((input, inputIndex) => {
      const id = input.getAttribute('id');
      const label = document.querySelector(`label[for="${id}"]`);
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');

      // Check for accessible name
      if (!label && !ariaLabel && !ariaLabelledBy) {
        issues.push(`Form ${formIndex + 1}, Input ${inputIndex + 1} missing accessible name`);
      }

      // Check for required field indication
      if (input.hasAttribute('required')) {
        const hasRequiredIndicator = input.getAttribute('aria-required') === 'true' ||
                                   input.getAttribute('aria-describedby') ||
                                   (label && label.textContent?.includes('*'));
        
        if (!hasRequiredIndicator) {
          issues.push(`Form ${formIndex + 1}, Input ${inputIndex + 1} required but not indicated`);
        }
      }

      // Check for error handling
      if (input.getAttribute('aria-invalid') === 'true') {
        const hasErrorMessage = input.getAttribute('aria-describedby') ||
                              form.querySelector('.error-message');
        
        if (!hasErrorMessage) {
          issues.push(`Form ${formIndex + 1}, Input ${inputIndex + 1} invalid but no error message`);
        }
      }
    });
  });

  return issues.length === 0;
};

/**
 * Comprehensive accessibility audit
 */
export const performAccessibilityAudit = (): AccessibilityReport => {
  const issues: AccessibilityIssue[] = [];
  
  // Test color contrast
  const colorContrastResults = testColorContrast();
  const failedContrast = colorContrastResults.filter(result => result.level === 'fail');
  
  failedContrast.forEach(result => {
    issues.push({
      type: 'error',
      rule: 'color-contrast',
      description: `Insufficient color contrast ratio: ${result.ratio.toFixed(2)} (minimum 4.5 required)`,
      wcagLevel: 'AA',
      wcagCriterion: '1.4.3'
    });
  });

  // Test keyboard navigation
  const keyboardNavigation = testKeyboardNavigation();
  if (!keyboardNavigation) {
    issues.push({
      type: 'error',
      rule: 'keyboard-navigation',
      description: 'Keyboard navigation issues detected',
      wcagLevel: 'A',
      wcagCriterion: '2.1.1'
    });
  }

  // Test screen reader support
  const screenReaderSupport = testScreenReaderSupport();
  if (!screenReaderSupport) {
    issues.push({
      type: 'error',
      rule: 'screen-reader-support',
      description: 'Screen reader support issues detected',
      wcagLevel: 'A',
      wcagCriterion: '1.3.1'
    });
  }

  // Test semantic structure
  const semanticStructure = testSemanticStructure();
  if (!semanticStructure) {
    issues.push({
      type: 'warning',
      rule: 'semantic-structure',
      description: 'Semantic HTML structure issues detected',
      wcagLevel: 'A',
      wcagCriterion: '1.3.1'
    });
  }

  // Test image accessibility
  const imageAccessibility = testImageAccessibility();
  if (!imageAccessibility) {
    issues.push({
      type: 'error',
      rule: 'image-accessibility',
      description: 'Image accessibility issues detected',
      wcagLevel: 'A',
      wcagCriterion: '1.1.1'
    });
  }

  // Test form accessibility
  const formAccessibility = testFormAccessibility();
  if (!formAccessibility) {
    issues.push({
      type: 'error',
      rule: 'form-accessibility',
      description: 'Form accessibility issues detected',
      wcagLevel: 'A',
      wcagCriterion: '3.3.2'
    });
  }

  // Calculate overall score
  const totalTests = 6;
  const passedTests = [
    keyboardNavigation,
    screenReaderSupport,
    semanticStructure,
    imageAccessibility,
    formAccessibility,
    failedContrast.length === 0
  ].filter(Boolean).length;

  const score = Math.round((passedTests / totalTests) * 100);

  return {
    score,
    issues,
    colorContrast: colorContrastResults,
    keyboardNavigation,
    screenReaderSupport,
    semanticStructure,
    imageAccessibility,
    formAccessibility
  };
};

/**
 * Generate accessibility report
 */
export const generateAccessibilityReport = (): void => {
  if (import.meta.env.MODE !== 'development') return;

  const report = performAccessibilityAudit();

  console.group('♿ Accessibility Audit Report');
  
  console.log(`Overall Score: ${report.score}/100`);
  
  console.log('Test Results:', {
    'Keyboard Navigation': report.keyboardNavigation ? '✅ Pass' : '❌ Fail',
    'Screen Reader Support': report.screenReaderSupport ? '✅ Pass' : '❌ Fail',
    'Semantic Structure': report.semanticStructure ? '✅ Pass' : '❌ Fail',
    'Image Accessibility': report.imageAccessibility ? '✅ Pass' : '❌ Fail',
    'Form Accessibility': report.formAccessibility ? '✅ Pass' : '❌ Fail',
    'Color Contrast': report.colorContrast.filter(c => c.level !== 'fail').length + '/' + report.colorContrast.length + ' passed'
  });

  if (report.issues.length > 0) {
    console.group('Issues Found:');
    report.issues.forEach(issue => {
      const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`${icon} ${issue.rule}: ${issue.description} (WCAG ${issue.wcagLevel} ${issue.wcagCriterion})`);
    });
    console.groupEnd();
  }

  if (report.colorContrast.length > 0) {
    console.group('Color Contrast Results:');
    const contrastSummary = {
      'AAA Level': report.colorContrast.filter(c => c.level === 'AAA').length,
      'AA Level': report.colorContrast.filter(c => c.level === 'AA').length,
      'Failed': report.colorContrast.filter(c => c.level === 'fail').length
    };
    console.log(contrastSummary);
    console.groupEnd();
  }

  console.groupEnd();
};

/**
 * Test specific WCAG criteria
 */
export const testWCAGCriteria = (criterion: string): boolean => {
  switch (criterion) {
    case '1.1.1': // Non-text Content
      return testImageAccessibility();
    case '1.3.1': // Info and Relationships
      return testSemanticStructure() && testScreenReaderSupport();
    case '1.4.3': // Contrast (Minimum)
      return testColorContrast().every(result => result.level !== 'fail');
    case '2.1.1': // Keyboard
      return testKeyboardNavigation();
    case '3.3.2': // Labels or Instructions
      return testFormAccessibility();
    default:
      console.warn(`WCAG criterion ${criterion} not implemented`);
      return false;
  }
};

/**
 * Automated accessibility testing for CI/CD
 */
export const runAutomatedAccessibilityTests = (): Promise<AccessibilityReport> => {
  return new Promise((resolve) => {
    // Wait for page to be fully loaded
    setTimeout(() => {
      const report = performAccessibilityAudit();
      resolve(report);
    }, 1000);
  });
};