import { useEffect, useState } from 'react';
import {
  FriendRequestResponse,
  ApiResponse,
  Friend,
  FriendsAndRequests,
  FriendsResponse,
  ProviderProps,
} from '../types';
import useAuth from '../hooks/useAuth';
import axios, { AxiosResponse } from 'axios';
import api from '../utils/api';
import FriendContext from './FriendContext';

const FriendProvider = ({ children }: ProviderProps) => {
  const { isUserAuthenticated } = useAuth();
  const [friendsData, setFriendsData] = useState<FriendsAndRequests>({
    friends: [],
    outgoingRequests: [],
    incomingRequests: [],
  });

  useEffect(() => {
    const fetchFriends = async () => {
      try {
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
        if (axios.isAxiosError(error)) {
          console.error(error.response);
        } else {
          console.error(error);
        }
      }
    };

    fetchFriends();
  }, [isUserAuthenticated]);

  const sendFriendRequest = async (username: Friend['username']) => {
    try {
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
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        return error.response?.data;
      } else {
        console.error(error);
        return { status: 'error', message: 'Unknown error' };
      }
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
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        return error.response?.data;
      } else {
        console.error(error);
        return { status: 'error', message: 'Unknown error' };
      }
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
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        return error.response?.data;
      } else {
        console.error(error);
        return { status: 'error', message: 'Unknown error' };
      }
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
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        return error.response?.data;
      } else {
        console.error(error);
        return { status: 'error', message: 'Unknown error' };
      }
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
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        return error.response?.data;
      } else {
        console.error(error);
        return { status: 'error', message: 'Unknown error' };
      }
    }
  };

  return (
    <FriendContext.Provider
      value={{
        friendsData,
        sendFriendRequest,
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
