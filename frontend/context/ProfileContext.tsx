import { createContext } from 'react';
import { ApiAvatarResponse, ApiResponse } from '../types';

interface ProfileContextType {
  changeUsername: (username: string) => Promise<ApiResponse>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<ApiResponse>;
  uploadAvatar: (file: File) => Promise<ApiAvatarResponse>;
}

const profileContextReject = async () =>
  Promise.reject('ProfileContext not provided');

const defaultProfileContext: ProfileContextType = {
  changeUsername: profileContextReject,
  changePassword: profileContextReject,
  uploadAvatar: profileContextReject,
};

const ProfileContext = createContext<ProfileContextType>(defaultProfileContext);

export default ProfileContext;
