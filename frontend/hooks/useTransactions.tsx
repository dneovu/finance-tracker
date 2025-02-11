import { useContext } from 'react';
import TransactionContext from '../context/TransactionContext';

const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      'useTransactions должен использоваться внутри TransactionProvider'
    );
  }
  return context;
};

export default useTransactions;
