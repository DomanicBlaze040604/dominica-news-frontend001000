import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize the application
console.log('🚀 Initializing Dominica News Application...');

// Check for root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial, sans-serif;">
      <div style="text-align: center; color: #dc2626;">
        <h1>Application Error</h1>
        <p>Root element not found. Please check the HTML file.</p>
      </div>
    </div>
  `;
} else {
  console.log('✅ Root element found, rendering application...');
  
  try {
    createRoot(rootElement).render(<App />);
    console.log('✅ Dominica News application rendered successfully!');
  } catch (error) {
    console.error('❌ Failed to render application:', error);
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center; color: #dc2626;">
          <h1>Application Error</h1>
          <p>Failed to initialize the application. Please check the console for details.</p>
          <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; text-align: left;">
            ${error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    `;
  }
}

// Performance monitoring for development
if (import.meta.env.DEV) {
  console.log('🔧 Development mode - Performance monitoring enabled');
  
  // Monitor page load performance
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Check for performance issues
    if (loadTime > 3000) {
      console.warn('⚠️ Slow page load detected. Consider optimizing.');
    }
  });
  
  // Monitor for unhandled errors
  window.addEventListener('error', (event) => {
    console.error('🚨 Unhandled error:', event.error);
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
  });
}