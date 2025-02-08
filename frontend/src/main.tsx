import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import AuthProvider from '../context/AuthProvider.js';
import ProfileProvider from '../context/ProfileProvider.js';
import { BrowserRouter } from 'react-router';
import CateroryProvider from '../context/CategoryProvider.js';

createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider>
    <ProfileProvider>
      <CateroryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CateroryProvider>
    </ProfileProvider>
  </AuthProvider>
);
