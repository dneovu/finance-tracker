import { format } from 'date-fns';
import AddReminderForm from '../components/AddReminderForm';
import useReminders from '../hooks/useReminders';
import { Reminder } from '../types/reminder';
import AddSharedReminderForm from '../components/AddSharedReminderForm';
import RouteWrapper from '../components/RouteWrapper';
import RouteTitle from '../components/RouteTitle';
import ReminderItem from '../components/ReminderItem';

const Reminders = () => {
  const { remindersData, deactivateReminder } = useReminders();
  const isSharedLength = remindersData.sharedReminders.length > 0;
  const isRemindersLength = remindersData.reminders.length > 0;

  return (
    <RouteWrapper>
      <RouteTitle text="Напоминания" />
      <AddReminderForm />
      <AddSharedReminderForm />
      {!isSharedLength && !isRemindersLength && (
        <p className="text-primary">У вас пока нет напоминаний</p>
      )}
      <div className="mb-3 flex flex-col gap-3">
        {isSharedLength && (
          <h2 className="text-primary text-xl font-semibold">
            Входящие напоминания
          </h2>
        )}

        {remindersData.sharedReminders.map((reminder: Reminder) => {
          const localDate = format(
            new Date(reminder.dueDate + 'Z'),
            'dd-MM-yy HH:mm'
          );

          return (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              deactivateReminder={deactivateReminder}
              isShared={true}
              localDate={localDate}
            />
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {isRemindersLength && (
          <h2 className="text-primary text-xl font-semibold">Напоминания</h2>
        )}

        {remindersData.reminders.map((reminder: Reminder) => {
          const localDate = format(
            new Date(reminder.dueDate),
            'dd-MM-yy HH:mm'
          );

          return (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              deactivateReminder={deactivateReminder}
              isShared={false}
              localDate={localDate}
            />
          );
        })}
      </div>
    </RouteWrapper>
  );
};

export default Reminders;
