import { useEffect, useState } from 'react';
import api from '../utils/api';
import AuthContext from './AuthContext';
import { ApiResponse, User } from '../types';
import axios, { AxiosResponse } from 'axios';

interface AuthProviderProps {
  children?: React.ReactNode;
}

interface AuthResponse extends ApiResponse {
  user?: User;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res: AxiosResponse<AuthResponse> = await api.get('/check');
        if (res.data.user) {
          setUser(res.data.user);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response);
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user === null) {
      fetchUser();
    } else {
      setLoading(false);
    }
    console.log(user);
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
        updateUser,
        loading,
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
