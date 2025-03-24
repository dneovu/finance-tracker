import { createContext } from 'react';
import { ApiResponse, Friend, FriendsAndRequests } from '../types';

interface FriendContextType {
  friendsData: FriendsAndRequests;
  sendFriendRequest: (username: Friend['username']) => Promise<ApiResponse>;
  isSendingRequest: boolean;
  isLoading: boolean;
  acceptFriendRequest: (id: Friend['id']) => Promise<ApiResponse>;
  cancelFriendRequest: (id: Friend['id']) => Promise<ApiResponse>;
  declineFriendRequest: (id: Friend['id']) => Promise<ApiResponse>;
  deleteFriend: (id: Friend['id']) => Promise<ApiResponse>;
}

const categoryContextReject = async () =>
  Promise.reject('FriendContext not provided');

const defaultFriendContext: FriendContextType = {
  friendsData: {
    friends: [],
    outgoingRequests: [],
    incomingRequests: [],
  },
  sendFriendRequest: categoryContextReject,
  isSendingRequest: false,
  isLoading: false,
  acceptFriendRequest: categoryContextReject,
  deleteFriend: categoryContextReject,
  cancelFriendRequest: categoryContextReject,
  declineFriendRequest: categoryContextReject,
};

const FriendContext = createContext<FriendContextType>(defaultFriendContext);

export default FriendContext;
