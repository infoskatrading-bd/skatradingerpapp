import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { NavigationProvider } from './context/NavigationContext';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <NavigationProvider>
        <AppRoutes />
      </NavigationProvider>
    </BrowserRouter>
  );
}
