import { useState, useEffect } from 'react';
import api from '../utils/api';
import TransactionContext from './TransactionContext';
import { ApiResponse, Transactions, TransactionsResponse } from '../types';
import axios, { AxiosResponse } from 'axios';
import { ProviderProps } from '../types';
import useAuth from '../hooks/useAuth';

const TransactionProvider = ({ children }: ProviderProps) => {
  const { isUserAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<Transactions>([]);
  const [areTransactionsLoading, setAreTransactionsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setAreTransactionsLoading(true);
      try {
        const res: AxiosResponse<TransactionsResponse> =
          await api.get('/transactions');
        if (res.data.transactions) {
          setTransactions(res.data.transactions);
          console.log(res.data);
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
    fetchTransactions();
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
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
