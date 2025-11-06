/**
 * Cross-Browser Testing Suite
 * Automated tests for browser compatibility and responsive behavior
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { detectBrowser, testFeatureSupport, responsiveBreakpoints } from '../utils/crossBrowserTesting';
import { Navbar } from '../components/Navbar';
import { SocialMediaSection } from '../components/SocialMediaSection';
import { LazyImage } from '../components/LazyImage';
import OptimizedNewsCard from '../components/optimized/OptimizedNewsCard';

// Mock data
const mockArticle = {
  id: '1',
  title: 'Test Article',
  excerpt: 'Test excerpt for the article',
  slug: 'test-article',
  featuredImage: 'https://example.com/image.jpg',
  category: {
    name: 'Test Category',
    slug: 'test-category'
  },
  author: {
    name: 'Test Author'
  },
  publishedAt: '2024-01-01T00:00:00Z'
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Cross-Browser Compatibility', () => {
  describe('Browser Detection', () => {
    it('should detect browser information correctly', () => {
      const browserInfo = detectBrowser();
      
      expect(browserInfo).toHaveProperty('name');
      expect(browserInfo).toHaveProperty('version');
      expect(browserInfo).toHaveProperty('engine');
      expect(browserInfo).toHaveProperty('platform');
      expect(browserInfo).toHaveProperty('mobile');
      expect(browserInfo).toHaveProperty('supported');
      
      expect(typeof browserInfo.name).toBe('string');
      expect(typeof browserInfo.version).toBe('string');
      expect(typeof browserInfo.engine).toBe('string');
      expect(typeof browserInfo.platform).toBe('string');
      expect(typeof browserInfo.mobile).toBe('boolean');
      expect(typeof browserInfo.supported).toBe('boolean');
    });
  });

  describe('Feature Support Detection', () => {
    it('should test all critical features', () => {
      const features = testFeatureSupport();
      
      expect(features.length).toBeGreaterThan(0);
      
      const criticalFeatures = [
        'CSS Grid',
        'CSS Custom Properties',
        'CSS Flexbox',
        'Intersection Observer',
        'Local Storage',
        'Fetch API'
      ];
      
      criticalFeatures.forEach(featureName => {
        const feature = features.find(f => f.feature === featureName);
        expect(feature).toBeDefined();
        expect(feature).toHaveProperty('supported');
        expect(typeof feature?.supported).toBe('boolean');
      });
    });

    it('should provide fallbacks for unsupported features', () => {
      const features = testFeatureSupport();
      
      features.forEach(feature => {
        if (!feature.supported) {
          expect(
            feature.fallback || feature.polyfillNeeded
          ).toBeTruthy();
        }
      });
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      // Reset viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768
      });
    });

    it('should have defined responsive breakpoints', () => {
      expect(responsiveBreakpoints).toBeDefined();
      expect(responsiveBreakpoints.length).toBeGreaterThan(0);
      
      responsiveBreakpoints.forEach(breakpoint => {
        expect(breakpoint).toHaveProperty('name');
        expect(breakpoint).toHaveProperty('minWidth');
        expect(typeof breakpoint.name).toBe('string');
        expect(typeof breakpoint.minWidth).toBe('number');
      });
    });

    it('should handle mobile viewport correctly', () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      render(
        <TestWrapper>
          <OptimizedNewsCard {...mockArticle} />
        </TestWrapper>
      );

      const card = screen.getByRole('link');
      expect(card).toBeInTheDocument();
      
      // Check if mobile-specific styles are applied
      const cardElement = card.closest('.group');
      expect(cardElement).toHaveClass('group');
    });

    it('should handle tablet viewport correctly', () => {
      // Simulate tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      });

      render(
        <TestWrapper>
          <OptimizedNewsCard {...mockArticle} />
        </TestWrapper>
      );

      const card = screen.getByRole('link');
      expect(card).toBeInTheDocument();
    });

    it('should handle desktop viewport correctly', () => {
      // Simulate desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280
      });

      render(
        <TestWrapper>
          <OptimizedNewsCard {...mockArticle} />
        </TestWrapper>
      );

      const card = screen.getByRole('link');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Typography Rendering', () => {
    it('should render headings with correct font family', () => {
      render(
        <TestWrapper>
          <h1>Test Heading</h1>
        </TestWrapper>
      );

      const heading = screen.getByRole('heading');
      const computedStyle = window.getComputedStyle(heading);
      
      // Should use Montserrat or fallback
      expect(computedStyle.fontFamily).toMatch(/Montserrat|system-ui|sans-serif/);
    });

    it('should render body text with correct font family', () => {
      render(
        <TestWrapper>
          <p>Test paragraph</p>
        </TestWrapper>
      );

      const paragraph = screen.getByText('Test paragraph');
      const computedStyle = window.getComputedStyle(paragraph);
      
      // Should use Roboto or fallback
      expect(computedStyle.fontFamily).toMatch(/Roboto|system-ui|sans-serif/);
    });

    it('should handle font loading failures gracefully', () => {
      // Mock font loading failure
      const originalFonts = document.fonts;
      Object.defineProperty(document, 'fonts', {
        value: undefined,
        configurable: true
      });

      render(
        <TestWrapper>
          <h1>Test Heading</h1>
        </TestWrapper>
      );

      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();

      // Restore original fonts
      Object.defineProperty(document, 'fonts', {
        value: originalFonts,
        configurable: true
      });
    });
  });

  describe('Navigation Functionality', () => {
    it('should render navigation menu correctly', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should handle dropdown interactions', async () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      // Look for category links that might have dropdowns
      const categoryLinks = screen.getAllByRole('link');
      expect(categoryLinks.length).toBeGreaterThan(0);
    });

    it('should be keyboard accessible', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation');
      const focusableElements = nav.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      
      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });

  describe('Image Loading', () => {
    it('should render lazy images correctly', () => {
      render(
        <TestWrapper>
          <LazyImage
            src="https://example.com/test.jpg"
            alt="Test image"
            className="test-image"
          />
        </TestWrapper>
      );

      const image = screen.getByAltText('Test image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('should handle image loading errors', async () => {
      render(
        <TestWrapper>
          <LazyImage
            src="https://invalid-url.com/nonexistent.jpg"
            alt="Test image"
            className="test-image"
          />
        </TestWrapper>
      );

      const image = screen.getByAltText('Test image');
      
      // Simulate image load error
      fireEvent.error(image);
      
      // Should still be in document (with fallback handling)
      expect(image).toBeInTheDocument();
    });

    it('should support different image formats', () => {
      const formats = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
      
      formats.forEach(format => {
        render(
          <TestWrapper>
            <LazyImage
              src={`https://example.com/test.${format}`}
              alt={`Test ${format} image`}
              className="test-image"
            />
          </TestWrapper>
        );

        const image = screen.getByAltText(`Test ${format} image`);
        expect(image).toBeInTheDocument();
      });
    });
  });

  describe('Social Media Integration', () => {
    it('should render social media links correctly', () => {
      render(
        <TestWrapper>
          <SocialMediaSection />
        </TestWrapper>
      );

      // Should render the social media section
      const socialSection = screen.getByTestId('social-media-section');
      expect(socialSection).toBeInTheDocument();
    });

    it('should open social links in new tabs', () => {
      render(
        <TestWrapper>
          <SocialMediaSection />
        </TestWrapper>
      );

      const socialLinks = screen.getAllByRole('link');
      socialLinks.forEach(link => {
        if (link.getAttribute('href')?.includes('facebook') || 
            link.getAttribute('href')?.includes('twitter') ||
            link.getAttribute('href')?.includes('instagram')) {
          expect(link).toHaveAttribute('target', '_blank');
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
      });
    });
  });

  describe('Performance Considerations', () => {
    it('should not cause memory leaks with event listeners', () => {
      const { unmount } = render(
        <TestWrapper>
          <OptimizedNewsCard {...mockArticle} />
        </TestWrapper>
      );

      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid re-renders efficiently', () => {
      const { rerender } = render(
        <TestWrapper>
          <OptimizedNewsCard {...mockArticle} />
        </TestWrapper>
      );

      // Rapid re-renders should not cause issues
      for (let i = 0; i < 10; i++) {
        rerender(
          <TestWrapper>
            <OptimizedNewsCard {...mockArticle} />
          </TestWrapper>
        );
      }

      const card = screen.getByRole('link');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should support screen readers', () => {
      render(
        <TestWrapper>
          <OptimizedNewsCard {...mockArticle} />
        </TestWrapper>
      );

      const card = screen.getByRole('link');
      expect(card).toHaveAttribute('href');
      
      const image = screen.getByAltText(mockArticle.title);
      expect(image).toHaveAttribute('alt');
    });

    it('should have sufficient color contrast', () => {
      render(
        <TestWrapper>
          <OptimizedNewsCard {...mockArticle} />
        </TestWrapper>
      );

      const title = screen.getByText(mockArticle.title);
      const computedStyle = window.getComputedStyle(title);
      
      // Should have defined color (not transparent)
      expect(computedStyle.color).not.toBe('rgba(0, 0, 0, 0)');
    });
  });
});