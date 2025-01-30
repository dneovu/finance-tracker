import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import UserProvider from '../context/UserProvider.js';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root') as HTMLElement).render(
  <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserProvider>
);
