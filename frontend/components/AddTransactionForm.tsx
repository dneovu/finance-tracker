import { FormEvent, useEffect, useState } from 'react';
import useCategories from '../hooks/useCategories';
import useTransactions from '../hooks/useTransactions';
import { Category } from '../types';

const AddTransactionForm = () => {
  const { addTransaction } = useTransactions();
  const { categories } = useCategories();
  const [amount, setAmount] = useState('1'); // min input
  const [categoryId, setCategoryId] = useState('');

  const addTransactionHandler = async (e: FormEvent) => {
    e.preventDefault();
    const res = await addTransaction(
      Number(amount),
      new Date(),
      Number(categoryId)
    );
    console.log(res.transactions);
  };

  useEffect(() => {
    const firstCategory = Object.values(categories)[0]; // берем первый элемент списка
    if (firstCategory) {
      setCategoryId(firstCategory.id);
    }
  }, [categories]);

  return (
    <div className="flex w-fit">
      <form className="flex flex-col gap-2" onSubmit={addTransactionHandler}>
        <div className="flex">
          <div className="flex flex-col">
            <label htmlFor="amount">Сумма</label>
            <input
              className="border-2 border-slate-700 px-2 py-1 focus:outline-none"
              type="number"
              inputMode="numeric"
              name="amount"
              id="amount"
              min="1"
              max="1000000"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="category-select">Категория</label>
          <select
            name="category-select"
            id="category-select"
            className="border-2 border-slate-700 px-2 py-1 focus:outline-none"
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {Object.values(categories).map((category: Category) => (
              <option
                key={category.id}
                value={category.id}
                className="flex gap-3"
              >
                {category.name} ({category.type ? 'Доход' : 'Расход'})
              </option>
            ))}
          </select>
        </div>
        <button
          className="mt-4 cursor-pointer rounded-md border-2 border-slate-700 bg-slate-50 px-4 py-2"
          type="submit"
        >
          Добавить
        </button>
      </form>
    </div>
  );
};

export default AddTransactionForm;
