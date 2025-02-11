import { createContext } from 'react';
import { ApiResponse, AuthResponse, User } from '../types';

interface AuthContextType {
  user: User | null;
  isUserAuthenticated: boolean;
  updateUser: (newUser: User | null) => void;
  isUserLoading: boolean;
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<ApiResponse>;
  register: (username: string, password: string) => Promise<ApiResponse>;
}

const authContextReject = async () =>
  Promise.reject('AuthContext not provided');

const defaultAuthContext: AuthContextType = {
  user: null,
  isUserAuthenticated: false,
  updateUser: () => {},
  isUserLoading: false,
  login: authContextReject,
  logout: authContextReject,
  register: authContextReject,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export default AuthContext;
