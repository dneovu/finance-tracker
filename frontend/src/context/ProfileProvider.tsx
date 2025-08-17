import api from '@/utils/api';
import ProfileContext from './ProfileContext';
import { ApiAvatarResponse, ApiResponse, ProviderProps } from '@/types';
import { AxiosResponse } from 'axios';
import useAuth from '@/hooks/useAuth';
import handleProviderError from '@/utils/handleProviderError';
import { useState } from 'react';

const ProfileProvider = ({ children }: ProviderProps) => {
  const { user, updateUser } = useAuth();
  // состояния загрузки
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const changeUsername = async (username: string) => {
    try {
      setIsChangingUsername(true);
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
    } finally {
      setIsChangingUsername(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      setIsChangingPassword(true);
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
    } finally {
      setIsChangingPassword(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setIsUploadingAvatar(true);
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
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        changeUsername,
        changePassword,
        uploadAvatar,
        isChangingUsername,
        isChangingPassword,
        isUploadingAvatar,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
