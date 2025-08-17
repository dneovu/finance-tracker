import { Category } from "./category";

export interface Transaction {
  id: number;
  amount: number;
  date: string;
  category: Category;
}

export interface Transactions {
  [key: number]: Transaction;
}