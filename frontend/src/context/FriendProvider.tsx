import { useEffect, useState } from 'react';
import {
  FriendRequestResponse,
  ApiResponse,
  Friend,
  FriendsAndRequests,
  FriendsResponse,
  ProviderProps,
} from '@/types';
import useAuth from '@/hooks/useAuth';
import { AxiosResponse } from 'axios';
import api from '@/utils/api';
import FriendContext from './FriendContext';
import handleProviderError from '@/utils/handleProviderError';

const FriendProvider = ({ children }: ProviderProps) => {
  const { isUserAuthenticated } = useAuth();
  const [friendsData, setFriendsData] = useState<FriendsAndRequests>({
    friends: [],
    outgoingRequests: [],
    incomingRequests: [],
  });
  // состояния загрузки
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoading(true);
        const res: AxiosResponse<FriendsResponse> = await api.get('/friends');
        if (res.data) {
          setFriendsData({
            friends: res.data.friends ? res.data.friends : [],
            outgoingRequests: res.data.outgoing_requests
              ? res.data.outgoing_requests
              : [],
            incomingRequests: res.data.incoming_requests
              ? res.data.incoming_requests
              : [],
          });
        }
        console.log(res.data);
      } catch (error) {
        return handleProviderError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isUserAuthenticated) fetchFriends();
  }, [isUserAuthenticated]);

  const sendFriendRequest = async (username: Friend['username']) => {
    try {
      setIsSendingRequest(true);
      const res: AxiosResponse<FriendRequestResponse> = await api.post(
        '/friends/send-request',
        {
          username,
        }
      );
      if (res.data.friend) {
        setFriendsData((prev) => ({
          ...prev,
          outgoingRequests: [...prev.outgoingRequests, res.data.friend!],
        }));
      }
      console.log(res.data);
      return res.data;
    } catch (error) {
      return handleProviderError(error);
    } finally {
      setIsSendingRequest(false);
    }
  };

  const acceptFriendRequest = async (id: Friend['id']) => {
    try {
      const res: AxiosResponse<FriendRequestResponse> = await api.post(
        '/friends/accept-request',
        {
          id,
        }
      );

      if (res.data.friend) {
        setFriendsData((prev) => ({
          ...prev,
          incomingRequests: prev.incomingRequests.filter(
            (request) => request.id !== id
          ),
          friends: [...prev.friends, res.data.friend!],
        }));
      }
      console.log(res.data);
      return res.data;
    } catch (error) {
      return handleProviderError(error);
    }
  };

  const deleteFriend = async (id: Friend['id']) => {
    try {
      const res: AxiosResponse<ApiResponse> = await api.post(
        '/friends/delete-friend',
        {
          id,
        }
      );

      setFriendsData((prev) => ({
        ...prev,
        friends: prev.friends.filter((friend) => friend.id !== id),
      }));
      console.log(res.data);
      return res.data;
    } catch (error) {
      return handleProviderError(error);
    }
  };

  const cancelFriendRequest = async (id: Friend['id']) => {
    try {
      const res: AxiosResponse<ApiResponse> = await api.post(
        '/friends/cancel-request',
        {
          id,
        }
      );

      setFriendsData((prev) => ({
        ...prev,
        outgoingRequests: prev.outgoingRequests.filter(
          (request) => request.id !== id
        ),
      }));
      console.log(res.data);
      return res.data;
    } catch (error) {
      return handleProviderError(error);
    }
  };

  const declineFriendRequest = async (id: Friend['id']) => {
    try {
      const res: AxiosResponse<ApiResponse> = await api.post(
        '/friends/decline-request',
        {
          id,
        }
      );
      setFriendsData((prev) => ({
        ...prev,
        incomingRequests: prev.incomingRequests.filter(
          (request) => request.id !== id
        ),
      }));
      console.log(res.data);
      return res.data;
    } catch (error) {
      return handleProviderError(error);
    }
  };

  return (
    <FriendContext.Provider
      value={{
        friendsData,
        sendFriendRequest,
        isSendingRequest,
        isLoading,
        acceptFriendRequest,
        deleteFriend,
        cancelFriendRequest,
        declineFriendRequest,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

export default FriendProvider;
