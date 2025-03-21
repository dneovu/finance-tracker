import { useState } from 'react';
import useTransactions from '../hooks/useTransactions';
import { Budget, Category } from '../types';
import useCategories from '../hooks/useCategories';
import { format } from 'date-fns';
import AmountInput from './common/AmountInput';

const Budgets = () => {
  const { categories } = useCategories();
  const { budgets, addBudget, checkBudgetExceeded, deleteBudget } =
    useTransactions();

  const [amount, setAmount] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState<Budget['category_id']>(null);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    date.setMinutes(0);
    date.setHours(0);
    const localDate = format(new Date(date), 'yyyy-MM-dd');
    setStartDate(localDate); // форматируем в 'YYYY-MM-DD'
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    date.setSeconds(59);
    date.setMinutes(59);
    date.setHours(23);
    const localDate = format(new Date(date), 'yyyy-MM-dd');
    setEndDate(localDate); // форматируем в 'YYYY-MM-DD'
  };

  const handleAddBudget = () => {
    if (!amount || !startDate || !endDate || startDate > endDate) {
      alert('Ошибка в данных!');
      return;
    }
    const curCat = categoryId ? categoryId : null;
    addBudget(Number(amount), startDate, endDate, curCat);
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold">Установить новый бюджет</h2>
      <AmountInput amount={amount} setAmount={setAmount} />
      <div className="flex items-center gap-2">
        <label>Дата начала:</label>
        <input
          className="rounded border p-1"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
        />
      </div>
      <div className="flex items-center gap-2">
        <label>Дата конца:</label>
        <input
          className="rounded border p-1"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>
      <div className="flex items-center gap-2">
        <label>Категория:</label>
        <select
          className="rounded border p-1"
          onChange={(e) => setCategoryId(Number(e.target.value))}
          value={categoryId ?? 'null'}
        >
          <option value="null">Общий бюджет</option>
          {Object.values(categories).map((category: Category) => {
            if (category.type === false)
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
          })}
        </select>
      </div>
      <button
        onClick={handleAddBudget}
        className="border-primary hover:border-background mt-4 w-fit cursor-pointer rounded-md border-1 bg-slate-50 px-4 py-2 transition-all"
      >
        Установить бюджет
      </button>
      {budgets.length === 0 ? (
        <p>У вас пока нет бюджетов</p>
      ) : (
        <>
          <h2>Ваши бюджеты</h2>
          {budgets.map((budget) => {
            const { isExceeded, totalSpent } = checkBudgetExceeded(budget);
            const overBudget = isExceeded
              ? `+${totalSpent - budget.amount}`
              : totalSpent - budget.amount;
            return (
              <div className="flex gap-3" key={budget.id}>
                <p
                  style={{
                    color: isExceeded ? 'red' : 'green',
                  }}
                >
                  {budget.category_id
                    ? `Категория: ${categories[budget.category_id].name}`
                    : 'Общий бюджет'}{' '}
                  {budget.amount} ₽ ({overBudget})
                </p>
                <p>
                  {format(budget.start_date, 'dd-MM-yy')} -{' '}
                  {format(budget.end_date, 'dd-MM-yy')}
                </p>
                <button
                  className="cursor-pointer"
                  onClick={() => deleteBudget(budget.id)}
                >
                  ❌
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Budgets;
