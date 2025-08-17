import { useState } from 'react';
import useReminders from '@/hooks/useReminders';
import DropdownForm from './DropdownForm';
import getMinDateTime from '@/utils/getMinDateTime';
import DateTimeInput from '../common/DateTimeInput';
import AmountInput from '../common/AmountInput';

const AddReminderForm = () => {
  const { addReminder, isAddingReminder } = useReminders();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('1');
  const [dueDateTime, setDueDateTime] = useState(getMinDateTime());
  const [isOpen, setIsOpen] = useState(true);

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
      setIsOpen={setIsOpen}
      handleSubmitForm={handleSubmit}
      isButtonLoading={isAddingReminder}
      title="Создать напоминание"
      buttonText="Создать"
    >
      <div className="flex flex-col">
        <label htmlFor="add-reminder">Название</label>
        <input
          className="border-primary rounded-sm border-2 px-2 py-1 focus:outline-none"
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
      <AmountInput amount={amount} setAmount={setAmount} />

      <DateTimeInput
        id="reminder-date-time"
        value={dueDateTime}
        setValue={setDueDateTime}
        minDateTime={getMinDateTime()}
        labelText="Дата и время"
      />
    </DropdownForm>
  );
};

export default AddReminderForm;
