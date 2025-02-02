import { createContext } from 'react';
import { ApiResponse, User } from '../types';

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<ApiResponse>;
  logout: () => Promise<ApiResponse>;
  register: (username: string, password: string) => Promise<ApiResponse>;
  changeUsername: (username: string) => Promise<ApiResponse>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<ApiResponse>;
}

const userContextReject = async () =>
  Promise.reject('UserContext not provided');

const defaultUserContext: UserContextType = {
  user: null,
  loading: false,
  login: userContextReject,
  logout: userContextReject,
  register: userContextReject,
  changeUsername: userContextReject,
  changePassword: userContextReject,
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export default UserContext;
