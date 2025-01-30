import { createContext } from 'react';
import { ApiResponse, User } from '../types';

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<ApiResponse>;
  logout: () => Promise<ApiResponse>;
  register: (username: string, password: string) => Promise<ApiResponse>;
}

const defaultUserContext: UserContextType = {
  user: null,
  loading: false,
  login: async () => Promise.reject('UserContext not provided'),
  logout: () => Promise.reject('UserContext not provided'),
  register: async () => Promise.reject('UserContext not provided'),
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export default UserContext;
