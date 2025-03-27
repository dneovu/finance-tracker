import { format } from 'date-fns';
import { ApiResponse, Budget } from '../../types';
import useCategories from '../../hooks/useCategories';

interface BudgetItemProps {
  isExceeded: boolean;
  overBudget: number;
  budget: Budget;
  deleteBudget: (id: number) => Promise<ApiResponse>;
}

const BudgetItem = ({
  isExceeded,
  overBudget,
  budget,
  deleteBudget,
}: BudgetItemProps) => {
  const { categories } = useCategories();

  return (
    <div className="bg-primary hover:border-secondary shadow-secondary group flex h-fit max-w-[30rem] items-center justify-between gap-4 rounded-lg border border-gray-300 p-4 tracking-wide shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="text-background flex flex-col gap-1">
        <p
          className={`text-lg font-semibold ${isExceeded ? 'text-red-800' : 'text-green-800'}`}
        >
          {budget.category_id
            ? `${categories[budget.category_id].name}:`
            : 'Общий бюджет:'}{' '}
          {budget.amount} ₽
        </p>
        <p className="text-sm">
          {`${isExceeded ? 'Превышен на' : 'До превышения'} ${overBudget} ₽`}
        </p>
        <p className="text-sm">
          {format(budget.start_date, 'dd.MM.yy')} —{' '}
          {format(budget.end_date, 'dd.MM.yy')}
        </p>
      </div>
      <button
        onClick={() => deleteBudget(budget.id)}
        className="hover:text-secondary mt-2 cursor-pointer transition-all"
      >
        Удалить
      </button>
    </div>
  );
};

export default BudgetItem;
