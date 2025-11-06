import React, { useEffect, useState } from 'react';
import { FontLoadingState, fontLoader } from '../../utils/fontLoader';

interface FontLoaderProps {
  children: React.ReactNode;
  fonts?: string[];
  fallbackClassName?: string;
  loadingClassName?: string;
  loadedClassName?: string;
}

/**
 * FontLoader component that manages font loading states
 * and prevents layout shift during font loading
 */
export const FontLoader: React.FC<FontLoaderProps> = ({
  children,
  fonts = ['Roboto', 'Montserrat'],
  fallbackClassName = 'font-fallback',
  loadingClassName = 'font-loading',
  loadedClassName = 'font-loaded'
}) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, FontLoadingState>>({});
  const [allFontsProcessed, setAllFontsProcessed] = useState(false);

  useEffect(() => {
    const initialStates: Record<string, FontLoadingState> = {};
    const unsubscribeFunctions: (() => void)[] = [];

    // Initialize loading states
    fonts.forEach(font => {
      initialStates[font] = fontLoader.isFontLoaded(font) 
        ? FontLoadingState.LOADED 
        : FontLoadingState.LOADING;

      // Subscribe to font loading state changes
      const unsubscribe = fontLoader.onFontStateChange(font, (state) => {
        setLoadingStates(prev => ({
          ...prev,
          [font]: state
        }));
      });
      unsubscribeFunctions.push(unsubscribe);

      // Start loading the font if not already loaded
      if (!fontLoader.isFontLoaded(font)) {
        fontLoader.loadFont(font, {
          timeout: 3000,
          onLoad: () => {
            console.log(`Font ${font} loaded successfully`);
          },
          onError: () => {
            console.warn(`Font ${font} failed to load, using fallback`);
          }
        });
      }
    });

    setLoadingStates(initialStates);

    // Cleanup subscriptions
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [fonts]);

  useEffect(() => {
    // Check if all fonts have been processed (loaded, error, or timeout)
    const allProcessed = fonts.every(font => {
      const state = loadingStates[font];
      return state === FontLoadingState.LOADED || 
             state === FontLoadingState.ERROR || 
             state === FontLoadingState.TIMEOUT;
    });

    setAllFontsProcessed(allProcessed);
  }, [loadingStates, fonts]);

  // Determine the appropriate CSS class based on loading states
  const getClassName = (): string => {
    if (!allFontsProcessed) {
      return loadingClassName;
    }

    const hasLoadedFonts = fonts.some(font => 
      loadingStates[font] === FontLoadingState.LOADED
    );

    return hasLoadedFonts ? loadedClassName : fallbackClassName;
  };

  return (
    <div className={getClassName()}>
      {children}
    </div>
  );
};

/**
 * Hook to get font loading states for multiple fonts
 */
export const useFontLoadingStates = (fonts: string[]) => {
  const [states, setStates] = useState<Record<string, FontLoadingState>>({});

  useEffect(() => {
    const initialStates: Record<string, FontLoadingState> = {};
    const unsubscribeFunctions: (() => void)[] = [];

    fonts.forEach(font => {
      initialStates[font] = fontLoader.isFontLoaded(font) 
        ? FontLoadingState.LOADED 
        : FontLoadingState.LOADING;

      const unsubscribe = fontLoader.onFontStateChange(font, (state) => {
        setStates(prev => ({
          ...prev,
          [font]: state
        }));
      });
      unsubscribeFunctions.push(unsubscribe);
    });

    setStates(initialStates);

    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [fonts]);

  return states;
};

/**
 * Hook to check if all specified fonts are loaded
 */
export const useAllFontsLoaded = (fonts: string[]): boolean => {
  const states = useFontLoadingStates(fonts);
  
  return fonts.every(font => 
    states[font] === FontLoadingState.LOADED
  );
};