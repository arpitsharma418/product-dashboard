import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { RouterProvider } from './context/RouterContext';
import { MutationProvider } from './context/MutationContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider>
        <MutationProvider>
          <App />
        </MutationProvider>
      </RouterProvider>
    </AuthProvider>
  </StrictMode>,
);
