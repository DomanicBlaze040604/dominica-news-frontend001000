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
preloadCriticalFonts();
optimizeResourceLoading();

// Development performance monitoring
if (import.meta.env.MODE === 'development') {
  setupCoreWebVitalsMonitoring();
  
  // Run cross-browser tests immediately
  runCrossBrowserTests();
  
  // Generate reports after app loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      generateBundleReport();
      performanceMonitor.generateReport();
      generateCompatibilityReport();
      generateAccessibilityReport();
    }, 3000);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
