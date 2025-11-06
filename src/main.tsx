import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { preloadCriticalFonts } from "./utils/fontLoader";
import { 
  generateBundleReport, 
  setupCoreWebVitalsMonitoring, 
  optimizeResourceLoading 
} from "./utils/bundleAnalyzer";
import { performanceMonitor } from "./utils/performanceMonitoring";
import { runCrossBrowserTests, generateCompatibilityReport } from "./utils/crossBrowserTesting";
import { generateAccessibilityReport } from "./utils/accessibilityTesting";

// Performance optimizations
try {
  preloadCriticalFonts();
  optimizeResourceLoading();
} catch (error) {
  console.warn('Performance optimization failed:', error);
}

// Development performance monitoring
if (import.meta.env.DEV) {
  try {
    setupCoreWebVitalsMonitoring();
    
    // Run cross-browser tests immediately
    runCrossBrowserTests();
    
    // Generate reports after app loads
    window.addEventListener('load', () => {
      setTimeout(() => {
        try {
          generateBundleReport();
          performanceMonitor.generateReport();
          generateCompatibilityReport();
          generateAccessibilityReport();
        } catch (error) {
          console.warn('Performance reporting failed:', error);
        }
      }, 3000);
    });
  } catch (error) {
    console.warn('Performance monitoring setup failed:', error);
  }
}

createRoot(document.getElementById("root")!).render(<App />);