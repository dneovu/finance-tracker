import { User } from './user';

export interface Friend extends User {
  id: number;
  status: number;
}

export type Friends = Friend[];

export interface FriendsAndRequests {
  friends: Friends;
  outgoingRequests: Friends;
  incomingRequests: Friends;
}
