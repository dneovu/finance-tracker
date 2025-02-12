import { Categories, Category } from './category';
import { Friend, Friends } from './friend';
import { Transactions } from './transaction';
import { User } from './user';

export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
  code?: string;
}

export interface ApiAvatarResponse extends ApiResponse {
  url?: string;
}

export interface AuthResponse extends ApiResponse {
  user?: User;
}

export interface CategoriesResponse extends ApiResponse {
  categories?: Categories;
}

export interface AddCategoryResponse extends ApiResponse {
  category?: Category;
}

export interface TransactionsResponse extends ApiResponse {
  transactions?: Transactions;
}

export interface FriendsResponse extends ApiResponse {
  friends?: Friends;
  outgoing_requests?: Friends;
  incoming_requests?: Friends;
}

export interface FriendRequestResponse extends ApiResponse {
  friend?: Friend;
}