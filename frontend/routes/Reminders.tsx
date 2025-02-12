import { format } from 'date-fns';
import AddReminderForm from '../components/AddReminderForm';
import useReminders from '../hooks/useReminders';
import { Reminder } from '../types/reminder';
import AddSharedReminderForm from '../components/AddSharedReminderForm';

const Reminders = () => {
  const { remindersData, deactivateReminder } = useReminders();

  return (
    <div>
      <AddReminderForm />
      <AddSharedReminderForm />
      <h2 className="mt-6 text-lg font-bold">Входящие напоминания</h2>
      <ul className="mt-2 rounded-md border p-2">
        {remindersData.sharedReminders.length > 0 ? (
          remindersData.sharedReminders.map((reminder: Reminder) => {
            const localDate = format(
              new Date(reminder.dueDate + 'Z'),
              'dd-MM-yy HH:mm'
            );

            return (
              <li key={reminder.id} className="flex flex-wrap justify-between border-b p-2 last:border-0">
                <p>{localDate} | {reminder.amount} ₽ {reminder.name}</p>
                <button onClick={() => deactivateReminder(reminder.id, true)}>❌</button>
              </li>
            );
          })
        ) : (
          <p className="text-gray-500">Напоминаний нет</p>
        )}
      </ul>
      <h2 className="mt-6 text-lg font-bold">Напоминания</h2>
      <ul className="mt-2 rounded-md border p-2">
        {remindersData.reminders.length > 0 ? (
          remindersData.reminders.map((reminder: Reminder) => {
            const localDate = format(
              new Date(reminder.dueDate),
              'dd-MM-yy HH:mm'
            );

            return (
              <li key={reminder.id} className="flex flex-wrap justify-between border-b p-2 last:border-0">
                <p>{localDate} | {reminder.amount} ₽ {reminder.name}</p>
                <button onClick={() => deactivateReminder(reminder.id, false)}>❌</button>
              </li>
            );
          })
        ) : (
          <p className="text-gray-500">Напоминаний нет</p>
        )}
      </ul>
    </div>
  );
};

export default Reminders;
