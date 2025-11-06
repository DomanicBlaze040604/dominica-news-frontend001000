/**
 * Font Loading Utilities
 * Handles font loading optimization and prevents FOUT/FOIT
 */

export interface FontLoadingOptions {
  timeout?: number;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Font loading states
 */
export enum FontLoadingState {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
  TIMEOUT = 'timeout'
}

/**
 * Font loading manager class
 */
class FontLoader {
  private loadedFonts = new Set<string>();
  private loadingPromises = new Map<string, Promise<void>>();
  private observers = new Map<string, ((state: FontLoadingState) => void)[]>();

  /**
   * Load a font with timeout and fallback handling
   */
  async loadFont(
    fontFamily: string, 
    options: FontLoadingOptions = {}
  ): Promise<FontLoadingState> {
    const { timeout = 3000, onLoad, onError } = options;

    // Return immediately if font is already loaded
    if (this.loadedFonts.has(fontFamily)) {
      onLoad?.();
      return FontLoadingState.LOADED;
    }

    // Return existing promise if font is currently loading
    if (this.loadingPromises.has(fontFamily)) {
      try {
        await this.loadingPromises.get(fontFamily);
        return FontLoadingState.LOADED;
      } catch {
        return FontLoadingState.ERROR;
      }
    }

    // Create new loading promise
    const loadingPromise = this.createLoadingPromise(fontFamily, timeout);
    this.loadingPromises.set(fontFamily, loadingPromise);

    try {
      await loadingPromise;
      this.loadedFonts.add(fontFamily);
      this.loadingPromises.delete(fontFamily);
      this.notifyObservers(fontFamily, FontLoadingState.LOADED);
      onLoad?.();
      return FontLoadingState.LOADED;
    } catch (error) {
      this.loadingPromises.delete(fontFamily);
      const state = error instanceof Error && error.message === 'timeout' 
        ? FontLoadingState.TIMEOUT 
        : FontLoadingState.ERROR;
      this.notifyObservers(fontFamily, state);
      onError?.();
      return state;
    }
  }

  /**
   * Create a font loading promise with timeout
   */
  private createLoadingPromise(fontFamily: string, timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      // Use Font Loading API if available
      if ('fonts' in document) {
        const font = new FontFace(fontFamily, `url(https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')})`);
        
        const timeoutId = setTimeout(() => {
          reject(new Error('timeout'));
        }, timeout);

        font.load()
          .then(() => {
            clearTimeout(timeoutId);
            document.fonts.add(font);
            resolve();
          })
          .catch(() => {
            clearTimeout(timeoutId);
            reject(new Error('load-error'));
          });
      } else {
        // Fallback for browsers without Font Loading API
        this.fallbackFontLoad(fontFamily, timeout, resolve, reject);
      }
    });
  }

  /**
   * Fallback font loading method for older browsers
   */
  private fallbackFontLoad(
    fontFamily: string,
    timeout: number,
    resolve: () => void,
    reject: (error: Error) => void
  ): void {
    const testString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const fallbackFont = 'monospace';
    
    // Create test elements
    const testElement = document.createElement('div');
    testElement.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      font-size: 72px;
      font-family: ${fallbackFont};
      visibility: hidden;
    `;
    testElement.textContent = testString;
    document.body.appendChild(testElement);
    
    const fallbackWidth = testElement.offsetWidth;
    testElement.style.fontFamily = `${fontFamily}, ${fallbackFont}`;
    
    let attempts = 0;
    const maxAttempts = timeout / 50;
    
    const checkFont = () => {
      attempts++;
      
      if (testElement.offsetWidth !== fallbackWidth) {
        document.body.removeChild(testElement);
        resolve();
        return;
      }
      
      if (attempts >= maxAttempts) {
        document.body.removeChild(testElement);
        reject(new Error('timeout'));
        return;
      }
      
      setTimeout(checkFont, 50);
    };
    
    checkFont();
  }

  /**
   * Subscribe to font loading state changes
   */
  onFontStateChange(fontFamily: string, callback: (state: FontLoadingState) => void): () => void {
    if (!this.observers.has(fontFamily)) {
      this.observers.set(fontFamily, []);
    }
    
    this.observers.get(fontFamily)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.observers.get(fontFamily);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Notify observers of font state changes
   */
  private notifyObservers(fontFamily: string, state: FontLoadingState): void {
    const callbacks = this.observers.get(fontFamily);
    if (callbacks) {
      callbacks.forEach(callback => callback(state));
    }
  }

  /**
   * Check if a font is loaded
   */
  isFontLoaded(fontFamily: string): boolean {
    return this.loadedFonts.has(fontFamily);
  }

  /**
   * Get all loaded fonts
   */
  getLoadedFonts(): string[] {
    return Array.from(this.loadedFonts);
  }

  /**
   * Clear all loaded fonts (useful for testing)
   */
  clearLoadedFonts(): void {
    this.loadedFonts.clear();
    this.loadingPromises.clear();
    this.observers.clear();
  }
}

// Export singleton instance
export const fontLoader = new FontLoader();

/**
 * Hook for React components to use font loading
 */
export const useFontLoader = (fontFamily: string, options: FontLoadingOptions = {}) => {
  const [state, setState] = React.useState<FontLoadingState>(
    fontLoader.isFontLoaded(fontFamily) ? FontLoadingState.LOADED : FontLoadingState.LOADING
  );

  React.useEffect(() => {
    if (fontLoader.isFontLoaded(fontFamily)) {
      setState(FontLoadingState.LOADED);
      return;
    }

    const unsubscribe = fontLoader.onFontStateChange(fontFamily, setState);
    
    fontLoader.loadFont(fontFamily, options);

    return unsubscribe;
  }, [fontFamily, options]);

  return state;
};

/**
 * Preload critical fonts on app initialization
 */
export const preloadCriticalFonts = async (): Promise<void> => {
  const criticalFonts = ['Roboto', 'Montserrat'];
  
  const loadPromises = criticalFonts.map(font => 
    fontLoader.loadFont(font, { timeout: 2000 })
  );

  try {
    await Promise.allSettled(loadPromises);
  } catch (error) {
    console.warn('Some critical fonts failed to load:', error);
  }
};

// Add React import for the hook
import React from 'react';