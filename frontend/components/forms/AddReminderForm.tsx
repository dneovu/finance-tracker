import { useState } from 'react';
import useReminders from '../../hooks/useReminders';
import DropdownForm from './DropdownForm';
import getMinDateTime from '../../utils/getMinDateTime';

const AddReminderForm = () => {
  const { addReminder } = useReminders();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('1');
  const [dueDateTime, setDueDateTime] = useState(getMinDateTime());
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const utcDate = new Date(`${dueDateTime}:00Z`);

    const res = await addReminder(Number(amount), name, utcDate);

    if (res.status === 'success') {
      setName('');
      setAmount('1');
      setDueDateTime(getMinDateTime());
    }
    console.log(res);
  };

  return (
    <DropdownForm
      isOpen={isOpen}
      setIsOpen={() => setIsOpen((prev) => !prev)}
      handleSubmitForm={handleSubmit}
      title="Создать напоминание"
      buttonText="Создать"
    >
      <div className="flex flex-col">
        <label htmlFor="add-reminder">Название</label>
        <input
          className="border-primary border-2 px-2 py-1 focus:outline-none"
          type="text"
          name="add-reminder"
          id="add-reminder"
          required
          minLength={1}
          maxLength={20}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="amount">Сумма</label>
        <input
          className="border-primary border-2 px-2 py-1 focus:outline-none"
          type="number"
          inputMode="numeric"
          name="amount"
          id="amount"
          min="1"
          max="1000000"
          step="any"
          value={amount}
          required
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label>Дата и время</label>
        <input
          type="datetime-local"
          className="border-primary border-2 px-2 py-1 focus:outline-none"
          min={getMinDateTime()}
          value={dueDateTime}
          required
          onChange={(e) => setDueDateTime(e.target.value)}
        />
      </div>
    </DropdownForm>
  );
};

export default AddReminderForm;
