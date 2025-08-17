import { FormEvent, useState } from 'react';
import useCategories from '@/hooks/useCategories';
import useTransactions from '@/hooks/useTransactions';
import { Budget, Category } from '@/types';
import AmountInput from '../common/AmountInput';
import { format } from 'date-fns';
import DropdownForm from './DropdownForm';
import notify from '@/utils/notify';
import DateInput from '../common/DateInput';
import SelectInput from '../common/SelectInput';

const AddBudgetForm = () => {
  const { categories } = useCategories();
  const { addBudget, isAddingBudget } = useTransactions();

  const [amount, setAmount] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState<Budget['category_id']>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleAddBudget = async (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !startDate || !endDate || startDate > endDate) {
      notify.error('Ошибка в данных!');
      return;
    }
    const curCat = categoryId ? categoryId : null;
    const res = await addBudget(Number(amount), startDate, endDate, curCat);
    if (res.status === 'error') {
      notify.error(res.message);
    } else {
      setStartDate('');
      setEndDate('');
      setAmount('1');
      setCategoryId(null);
    }
  };

  return (
    <DropdownForm
      title="Добавить бюджет"
      buttonText="Добавить"
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      handleSubmitForm={handleAddBudget}
      isButtonLoading={isAddingBudget}
    >
      <AmountInput amount={amount} setAmount={setAmount} />
      <DateInput
        id="start-date"
        value={startDate}
        setValue={handleStartDateChange}
        labelText="Дата начала"
      />
      <DateInput
        id="end-date"
        value={endDate}
        setValue={handleEndDateChange}
        labelText="Дата конца"
      />
      <SelectInput
        id="budget-category"
        onChange={(e) => setCategoryId(Number(e.target.value))}
        value={categoryId ?? 'null'}
        labelText="Категория"
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
      </SelectInput>
    </DropdownForm>
  );
};

export default AddBudgetForm;
