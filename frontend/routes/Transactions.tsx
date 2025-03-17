import { useState } from 'react';
import AddTransactionForm from '../components/forms/AddTransactionForm';
import Budgets from '../components/Budgets';
import TransactionFilter from '../components/TransactionFilter';
import RouteWrapper from '../components/wrappers/RouteWrapper';
import RouteTitle from '../components/RouteTitle';
import BackButton from '../components/common/BackButton';
import RouteGrowContent from '../components/wrappers/RouteGrowContent';

const Transactions = () => {
  const [showTransactions, setShowTransactions] = useState(true);
  const [showBudgets, setShowBudgets] = useState(true);

  return (
    <RouteWrapper>
      <RouteGrowContent>
        <RouteTitle text="Транзакции" />
        <div className="flex flex-col gap-4">
          <div className="bg-primary rounded-lg p-4 shadow">
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

          <div className="bg-primary rounded-lg p-4 shadow">
            <button
              onClick={() => setShowBudgets(!showBudgets)}
              className="text-background font-semibold"
            >
              {showBudgets ? 'Скрыть' : 'Показать'} бюджеты
            </button>
            {showBudgets && <Budgets />}
          </div>
        </div>
      </RouteGrowContent>

      <BackButton />
    </RouteWrapper>
  );
};

export default Transactions;
