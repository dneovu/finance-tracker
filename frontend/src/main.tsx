import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import AuthProvider from '../context/AuthProvider.js';
import ProfileProvider from '../context/ProfileProvider.js';
import { BrowserRouter } from 'react-router';
import CateroryProvider from '../context/CategoryProvider.js';
import TransactionProvider from '../context/TransactionProvider.js';
import FriendProvider from '../context/FriendProvider.js';
import ReminderProvider from '../context/ReminderProvider.js';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider>
    <ProfileProvider>
      <FriendProvider>
        <ReminderProvider>
          <CateroryProvider>
            <TransactionProvider>
              <BrowserRouter>
                <App />
                <ToastContainer />
              </BrowserRouter>
            </TransactionProvider>
          </CateroryProvider>
        </ReminderProvider>
      </FriendProvider>
    </ProfileProvider>
  </AuthProvider>
);
