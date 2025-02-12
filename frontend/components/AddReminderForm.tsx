import { FormEvent, useState } from 'react';
import useReminders from '../hooks/useReminders';

const AddReminderForm = () => {
  const { addReminder } = useReminders();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('1');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

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
    <div className="flex w-fit flex-col">
      <form className="flex flex-col gap-2" onSubmit={addReminderHandler}>
        <div className="flex flex-col">
          <label htmlFor="add-reminder">Название</label>
          <input
            className="border-2 border-slate-700 px-2 py-1 focus:outline-none"
            type="text"
            name="add-reminder"
            id="add-reminder"
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        <div className="flex flex-col">
          <label>Дата напоминания</label>
          <input
            type="date"
            className="border-2 border-slate-700 px-2 py-1 focus:outline-none"
            min={new Date().toISOString().split('T')[0]}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>Время напоминания</label>
          <input
            type="time"
            className="border-2 border-slate-700 px-2 py-1 focus:outline-none"
            min={
              dueDate === new Date().toISOString().split('T')[0]
                ? new Date().toLocaleTimeString('it-IT').slice(0, 5)
                : undefined
            }
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
        </div>
        <button
          className="mt-4 cursor-pointer rounded-md border-2 border-slate-700 bg-slate-50 px-4 py-2"
          type="submit"
        >
          Создать
        </button>
      </form>
    </div>
  );
};

export default AddReminderForm;
