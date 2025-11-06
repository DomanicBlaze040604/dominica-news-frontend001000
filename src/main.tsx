import { createRoot } from "react-dom/client";
import App from "./App.tsx";

console.log('🚀 Starting Dominica News App...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Root element not found!');
} else {
  console.log('✅ Root element found, rendering app...');
  createRoot(rootElement).render(<App />);
  console.log('✅ App rendered successfully!');
}