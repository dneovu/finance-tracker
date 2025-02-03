import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import AuthProvider from '../context/AuthProvider.js';
import ProfileProvider from '../context/ProfileProvider.js';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider>
    <ProfileProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProfileProvider>
  </AuthProvider>
);
