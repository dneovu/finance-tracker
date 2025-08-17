import AddTransactionForm from '@/components/forms/AddTransactionForm';
import TransactionFilter from '@/components/TransactionFilter';
import RouteWrapper from '@/components/wrappers/RouteWrapper';
import RouteTitle from '@/components/common/RouteTitle';
import BackButton from '@/components/common/BackButton';
import RouteGrowContent from '@/components/wrappers/RouteGrowContent';
import Budgets from '@/components/Budgets';
import AddBudgetForm from '@/components/forms/AddBudgetForm';

const Transactions = () => {
  return (
    <RouteWrapper>
      <RouteGrowContent>
        <RouteTitle text="Транзакции" />
        <AddTransactionForm />
        <AddBudgetForm />
        <TransactionFilter />
        <Budgets />
      </RouteGrowContent>
      <BackButton />
    </RouteWrapper>
  );
};

export default Transactions;
