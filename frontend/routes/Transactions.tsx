import AddTransactionForm from '../components/AddTransactionForm';
import Budgets from '../components/Budgets';
import TransactionFilter from '../components/TransactionFilter';

const Transactions = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="font-bold">Транзакции</h1>
      <AddTransactionForm />
      <TransactionFilter />
      <h2 className="font-bold">Бюджеты</h2>
      <Budgets />
    </div>
  );
};

export default Transactions;
