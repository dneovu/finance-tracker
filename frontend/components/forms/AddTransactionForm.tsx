import { FormEvent, useEffect, useState } from 'react';
import useCategories from '../../hooks/useCategories';
import useTransactions from '../../hooks/useTransactions';
import { Category } from '../../types';
import AmountInput from '../common/AmountInput';
import DropdownForm from './DropdownForm';
import SelectInput from '../common/SelectInput';

const AddTransactionForm = () => {
  const { addTransaction, isAddingTransaction } = useTransactions();
  const { categories } = useCategories();
  const [amount, setAmount] = useState('1'); // min input
  const [categoryId, setCategoryId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const sortedCategories = Object.values(categories).sort(
    (a: Category, b: Category) => Number(a.type) - Number(b.type)
  );

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
    if (!categoryId) {
      const firstCategory = sortedCategories[0]; // берем первый элемент списка
      if (firstCategory) {
        setCategoryId(firstCategory.id);
      }
    }
  }, [sortedCategories]);

  return (
    <DropdownForm
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleSubmitForm={addTransactionHandler}
      isButtonLoading={isAddingTransaction}
      title="Добавить транзакцию"
      buttonText="Добавить"
    >
      <AmountInput amount={amount} setAmount={setAmount} />
      <SelectInput
        id="category-select"
        onChange={(e) => setCategoryId(e.target.value)}
        labelText="Категория"
      >
        {sortedCategories.map((category: Category) => (
          <option key={category.id} value={category.id} className="flex gap-3">
            {category.name} ({category.type ? 'Доход' : 'Расход'})
          </option>
        ))}
      </SelectInput>
    </DropdownForm>
  );
};

export default AddTransactionForm;
