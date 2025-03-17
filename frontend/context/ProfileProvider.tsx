import api from '../utils/api';
import ProfileContext from './ProfileContext';
import { ApiAvatarResponse, ApiResponse, ProviderProps } from '../types';
import { AxiosResponse } from 'axios';
import useAuth from '../hooks/useAuth';
import handleProviderError from '../utils/handleProviderError';

const ProfileProvider = ({ children }: ProviderProps) => {
  const { user, updateUser } = useAuth();

  const changeUsername = async (username: string) => {
    try {
      const res: AxiosResponse<ApiResponse> = await api.post(
        '/change-username',
        {
          username,
        }
      );

      updateUser(null); // для обновления сессии
      return res.data;
    } catch (error) {
      return handleProviderError(error);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const res: AxiosResponse<ApiResponse> = await api.post(
        '/change-password',
        {
          password: currentPassword,
          newPassword,
        }
      );

      updateUser(null); // для обновления сессии
      return res.data;
    } catch (error) {
      return handleProviderError(error);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res: AxiosResponse<ApiAvatarResponse> = await api.post(
        '/upload-avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      // обновление аватара в user state
      if (user && res.data.url) {
        updateUser({ ...user, logo: res.data.url });
      }

      return res.data;
    } catch (error) {
      return handleProviderError(error);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        changeUsername,
        changePassword,
        uploadAvatar,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
