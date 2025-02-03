import { createContext } from 'react';
import { ApiResponse, User } from '../types';

interface AuthContextType {
  user: User | null;
  updateUser: (newUser: User | null) => void;
  loading: boolean;
  login: (username: string, password: string) => Promise<ApiResponse>;
  logout: () => Promise<ApiResponse>;
  register: (username: string, password: string) => Promise<ApiResponse>;
}

const authContextReject = async () =>
  Promise.reject('AuthContext not provided');

const defaultAuthContext: AuthContextType = {
  user: null,
  updateUser: () => {},
  loading: false,
  login: authContextReject,
  logout: authContextReject,
  register: authContextReject,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export default AuthContext;
