import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import AuthProvider from '../context/AuthProvider.js';
import ProfileProvider from '../context/ProfileProvider.js';
import { BrowserRouter } from 'react-router';
import CateroryProvider from '../context/CategoryProvider.js';
import TransactionProvider from '../context/TransactionProvider.js';
import FriendProvider from '../context/FriendProvider.js';

createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider>
    <ProfileProvider>
      <FriendProvider>
        <CateroryProvider>
          <TransactionProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </TransactionProvider>
        </CateroryProvider>
      </FriendProvider>
    </ProfileProvider>
  </AuthProvider>
);
