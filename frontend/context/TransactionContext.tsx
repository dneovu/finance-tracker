import { createContext } from 'react';
import { TransactionsResponse, Transactions, ApiResponse } from '../types';

interface TransactionContextType {
  transactions: Transactions;
  areTransactionsLoading: boolean;
  addTransaction: (
    amount: number,
    date: Date,
    category_id: number
  ) => Promise<TransactionsResponse>;
  deleteTransaction: (id: number) => Promise<ApiResponse>;
}

const transactionContextReject = async () =>
  Promise.reject('TransactionContext not provided');

const defaultTransactionContext: TransactionContextType = {
  transactions: [],
  areTransactionsLoading: false,
  addTransaction: transactionContextReject,
  deleteTransaction: transactionContextReject,
};

const TransactionContext = createContext<TransactionContextType>(
  defaultTransactionContext
);

export default TransactionContext;
