import { useEffect, useState } from 'react';
import api from '../utils/api';
import AuthContext from './AuthContext';
import { ApiResponse, ProviderProps, User } from '../types';
import axios, { AxiosResponse } from 'axios';

interface AuthResponse extends ApiResponse {
  user?: User;
}

const AuthProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsUserLoading(true);
      try {
        const res: AxiosResponse<AuthResponse> = await api.get('/check');
        if (res.data.user) {
          setUser(res.data.user);
          console.log(res.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response);
        } else {
          console.error(error);
        }
      } finally {
        setIsUserLoading(false);
      }
    };

    if (user === null) {
      fetchUser();
    } else {
      setIsUserLoading(false);
      setIsUserAuthenticated(true);
    }
  }, [user]);

  const login = async (username: string, password: string) => {
    try {
      const res: AxiosResponse<AuthResponse> = await api.post('/login', {
        username,
        password,
      });
      if (res.data.user) {
        setUser(res.data.user);
      }

      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        return error.response?.data;
      } else {
        console.error(error);
        return { status: 'error', message: 'Unknown error' };
      }
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const res: AxiosResponse<ApiResponse> = await api.post('/register', {
        username,
        password,
      });
      console.log(res);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        return error.response?.data;
      } else {
        console.error(error);
        return { status: 'error', message: 'Unknown error' };
      }
    }
  };

  const logout = async () => {
    try {
      const res = await api.post('logout');
      setUser(null);
      setIsUserAuthenticated(false);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        return error.response?.data;
      } else {
        console.error(error);
      }
    }
  };

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isUserAuthenticated,
        updateUser,
        isUserLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
