import { useState, useEffect } from 'react';
import api from '../utils/api';
import TransactionContext from './TransactionContext';
import {
  Transactions,
  TransactionsResponse,
  Budget,
  BudgetsResponse,
  Transaction,
  Budgets,
  ApiResponse,
} from '../types';
import axios, { AxiosResponse } from 'axios';
import { ProviderProps } from '../types';
import useAuth from '../hooks/useAuth';
import useCategories from '../hooks/useCategories';

const TransactionProvider = ({ children }: ProviderProps) => {
  const { isUserAuthenticated } = useAuth();
  const { categories } = useCategories();
  const [transactions, setTransactions] = useState<Transactions>([]);
  const [budgets, setBudgets] = useState<Budgets>([]);
  const [areTransactionsLoading, setAreTransactionsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setAreTransactionsLoading(true);
      try {
        const res: AxiosResponse<TransactionsResponse> =
          await api.get('/transactions');
        if (res.data.transactions) {
          setTransactions(res.data.transactions);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response);
        } else {
          console.error(error);
        }
      } finally {
        setAreTransactionsLoading(false);
      }
    };

    const fetchBudgets = async () => {
      try {
        const res: AxiosResponse<BudgetsResponse> = await api.get('/budgets');
        if (res.data.budgets) {
          setBudgets(res.data.budgets);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response);
        } else {
          console.error(error);
        }
      }
    };

    fetchTransactions();
    fetchBudgets();
  }, [isUserAuthenticated]);

  const addTransaction = async (
    amount: number,
    date: Date,
    category_id: number
  ) => {
    try {
      const res: AxiosResponse<TransactionsResponse> = await api.post(
        '/add-transaction',
        {
          amount,
          date,
          category_id,
        }
      );
      const newTransaction = res.data.transactions;
      if (newTransaction) {
        // добавление транзакции в стейт
        setTransactions((prevT) => ({
          ...prevT,
          ...newTransaction,
        }));
      }
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

  const deleteTransaction = async (id: number) => {
    try {
      const res: AxiosResponse<ApiResponse> = await api.post(
        '/delete-transaction',
        {
          id,
        }
      );

      // удаляем транзакцию из стейта
      setTransactions((prevTransactions) => {
        const updatedTransactions = { ...prevTransactions };
        delete updatedTransactions[id];
        return updatedTransactions;
      });
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

  const addBudget = async (
    amount: number,
    start_date: string,
    end_date: string,
    category_id: number | null
  ) => {
    try {
      const res: AxiosResponse<{ status: string; budget: Budget }> =
        await api.post('/add-budget', {
          amount,
          start_date,
          end_date,
          category_id: category_id ?? null,
        });

      if (res.data.budget) {
        setBudgets((prev) => [...prev, res.data.budget]);
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

  const checkBudgetExceeded = (budget: Budget) => {
    const startDate = new Date(budget.start_date);
    startDate.setHours(0, 0, 0, 0); // границы в UTC

    const endDate = new Date(budget.end_date);
    endDate.setHours(23, 59, 59, 999); // конец дня в UTC
    const totalSpent = Object.values(transactions)
      .filter((t: Transaction) => {
        const transactionDate = new Date(t.date + 'Z'); // приводим к UTC
        return (
          (!budget.category_id || t.category.id === budget.category_id) &&
          transactionDate >= startDate &&
          transactionDate <= endDate
        );
      })
      .reduce((sum: number, t: Transaction) => {
        const isIncome = categories[t.category.id].type === true; // определяем тип категории
        const amount = isIncome ? -t.amount : t.amount; // доходы уменьшают общие траты
        return sum + amount;
      }, 0);

    return totalSpent > budget.amount;
  };

  const deleteBudget = async (id: Budget['id']) => {
    try {
      const res: AxiosResponse<ApiResponse> = await api.post('/delete-budget', {
        id,
      });

      setBudgets((prev) => prev.filter((budget) => budget.id !== id));
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
    <TransactionContext.Provider
      value={{
        transactions,
        areTransactionsLoading,
        addTransaction,
        deleteTransaction,
        budgets,
        addBudget,
        checkBudgetExceeded,
        deleteBudget,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
