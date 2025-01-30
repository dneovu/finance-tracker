import { useEffect, useState } from 'react';
import api from '../utils/api';
import UserContext from './UserContext';
import { ApiResponse, User } from '../types';
import axios, { AxiosResponse } from 'axios';

interface UserProviderProps {
  children?: React.ReactNode;
}

interface UserResponse extends ApiResponse {
  user?: User;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res: AxiosResponse<UserResponse> = await api.get('/check');
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

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user]);

  const login = async (username: string, password: string) => {
    try {
      const res: AxiosResponse<UserResponse> = await api.post('/login', {
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

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
