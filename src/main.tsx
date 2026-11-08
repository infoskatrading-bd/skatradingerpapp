import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent browser extension injection errors from breaking runtime
window.addEventListener('error', (event) => {
  if (event.filename && event.filename.includes('chrome-extension://')) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(<App />);
