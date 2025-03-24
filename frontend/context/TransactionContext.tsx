import { createContext } from 'react';
import {
  TransactionsResponse,
  Transactions,
  ApiResponse,
  BudgetsResponse,
  Budgets,
  Budget,
} from '../types';

interface TransactionContextType {
  transactions: Transactions;
  areTransactionsLoading: boolean;
  areBudgetsLoading: boolean;
  addTransaction: (
    amount: number,
    date: Date,
    category_id: number
  ) => Promise<TransactionsResponse>;
  deleteTransaction: (id: number) => Promise<ApiResponse>;
  budgets: Budgets;
  addBudget: (
    amount: number,
    start_date: string,
    end_date: string,
    category_id: number | null
  ) => Promise<BudgetsResponse>;
  checkBudgetExceeded: (budget: Budget) => {
    isExceeded: boolean;
    totalSpent: number;
  };
  deleteBudget: (id: number) => Promise<ApiResponse>;
}

const transactionContextReject = async () =>
  Promise.reject('TransactionContext not provided');

const defaultTransactionContext: TransactionContextType = {
  transactions: [],
  areTransactionsLoading: false,
  areBudgetsLoading: false,
  addTransaction: transactionContextReject,
  deleteTransaction: transactionContextReject,
  budgets: [],
  addBudget: transactionContextReject,
  checkBudgetExceeded: () => {
    return {
      isExceeded: false,
      totalSpent: 0,
    };
  },
  deleteBudget: transactionContextReject,
};

const TransactionContext = createContext<TransactionContextType>(
  defaultTransactionContext
);

export default TransactionContext;
