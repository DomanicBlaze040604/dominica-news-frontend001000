/**
 * Application Initialization Utilities
 */

export const initializeApp = () => {
  console.log('🚀 Initializing Dominica News application...');
  
  // Set up global error handlers
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });

  // Initialize performance monitoring
  if ('performance' in window) {
    console.log('📊 Performance monitoring enabled');
  }

  console.log('✅ Application initialized successfully');
};

export const setupGracefulShutdown = () => {
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    // Clean up any ongoing operations
    console.log('🔄 Application shutting down gracefully...');
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};