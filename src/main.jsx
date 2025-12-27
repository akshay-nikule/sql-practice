import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.jsx'

/**
 * Register service worker for offline support with improved error handling
 */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers are not supported in this browser');
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration.scope);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update().catch(error => {
            console.warn('Failed to check for Service Worker updates:', error);
          });
        }, 60000); // Check every minute
      })
      .catch(error => {
        console.warn('Service Worker registration failed:', error);
        // App will still work without SW, just without offline support
      });
  });

  // Handle Service Worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service Worker controller changed - app has been updated');
  });
}

// Register service worker if available
registerServiceWorker();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
