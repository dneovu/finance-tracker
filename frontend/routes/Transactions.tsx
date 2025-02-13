import { useState } from 'react';
import AddTransactionForm from '../components/AddTransactionForm';
import Budgets from '../components/Budgets';
import TransactionFilter from '../components/TransactionFilter';
import RouteWrapper from '../components/RouteWrapper';
import RouteTitle from '../components/RouteTitle';

const Transactions = () => {
  const [showTransactions, setShowTransactions] = useState(true);
  const [showBudgets, setShowBudgets] = useState(true);

  return (
    <RouteWrapper>
      <RouteTitle text="Транзакции" />

      <div className="flex flex-col gap-4">
        <div className="bg-primary p-4 rounded-lg shadow">
          <button
            onClick={() => setShowTransactions(!showTransactions)}
            className="text-background font-semibold"
          >
            {showTransactions ? 'Скрыть' : 'Показать'} транзакции
          </button>
          {showTransactions && (
            <div className="mt-4 space-y-4">
              <AddTransactionForm />
              <TransactionFilter />
            </div>
          )}
        </div>

        <div className="bg-primary p-4 rounded-lg shadow">
          <button
            onClick={() => setShowBudgets(!showBudgets)}
            className="text-background font-semibold"
          >
            {showBudgets ? 'Скрыть' : 'Показать'} бюджеты
          </button>
          {showBudgets && <Budgets />}
        </div>
      </div>
    </RouteWrapper>
  );
};

export default Transactions;
