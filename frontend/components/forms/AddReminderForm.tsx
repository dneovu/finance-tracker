import { FormEvent, useState } from 'react';
import useReminders from '../hooks/useReminders';
import DropdownForm from './DropdownForm';

const AddReminderForm = () => {
  const { addReminder } = useReminders();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('1');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const addReminderHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!dueDate || !dueTime) return;

    const now = new Date();
    const selectedDateTime = new Date(`${dueDate}T${dueTime}`);

    if (selectedDateTime <= now) {
      return;
    }

    const utcDate = new Date(`${dueDate}T${dueTime}:00Z`);
    const res = await addReminder(Number(amount), name, utcDate);

    if (res.status === 'success') {
      setName('');
      setAmount('1');
      setDueDate('');
      setDueTime('');
    }
  };

  return (
    <DropdownForm
      isOpen={isOpen}
      setIsOpen={() => setIsOpen((prev) => !prev)}
      handleSubmitForm={addReminderHandler}
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
        <label>Дата напоминания</label>
        <input
          type="date"
          className="border-primary border-2 px-2 py-1 focus:outline-none"
          min={new Date().toISOString().split('T')[0]}
          value={dueDate}
          required
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label>Время напоминания</label>
        <input
          type="time"
          className="border-primary border-2 px-2 py-1 focus:outline-none"
          min={
            dueDate === new Date().toISOString().split('T')[0]
              ? new Date().toLocaleTimeString('it-IT').slice(0, 5)
              : undefined
          }
          value={dueTime}
          required
          onChange={(e) => setDueTime(e.target.value)}
        />
      </div>
    </DropdownForm>
  );
};

export default AddReminderForm;
