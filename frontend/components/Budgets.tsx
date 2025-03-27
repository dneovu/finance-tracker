import useCategories from '../hooks/useCategories';
import useTransactions from '../hooks/useTransactions';
import BudgetItem from './listItems/BudgetItem';

const Budgets = () => {
  const { budgets, checkBudgetExceeded, deleteBudget } = useTransactions();
  const { areCategoriesLoading } = useCategories();

  if (areCategoriesLoading) {
    return <p className="text-primary">Загрузка...</p>;
  }

  if (budgets.length === 0) {
    return <p className='text-primary'>У вас пока нет бюджетов.</p>;
  }

  return (
    <div className='flex flex-col gap-3'>
      <h2 className="text-primary text-xl font-semibold">Ваши бюджеты</h2>
      {budgets.map((budget) => {
        const { isExceeded, totalSpent } = checkBudgetExceeded(budget);
        const overBudget = Math.abs(totalSpent - budget.amount);

        return (
          <BudgetItem
            key={budget.id}
            isExceeded={isExceeded}
            overBudget={overBudget}
            budget={budget}
            deleteBudget={deleteBudget}
          />
        );
      })}
    </div>
  );
};

export default Budgets;
