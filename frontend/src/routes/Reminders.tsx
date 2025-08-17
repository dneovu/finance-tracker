import { format } from 'date-fns';
import AddReminderForm from '@/components/forms/AddReminderForm';
import useReminders from '@/hooks/useReminders';
import { Reminder } from '@/types/reminder';
import AddSharedReminderForm from '@/components/forms/AddSharedReminderForm';
import RouteWrapper from '@/components/wrappers/RouteWrapper';
import RouteTitle from '@/components/common/RouteTitle';
import ReminderItem from '@/components/listItems/ReminderItem';
import RouteGrowContent from '@/components/wrappers/RouteGrowContent';
import BackButton from '@/components/common/BackButton';

const Reminders = () => {
  const { remindersData, deactivateReminder, isLoading } = useReminders();
  const isSharedLength = remindersData.sharedReminders.length > 0;
  const isRemindersLength = remindersData.reminders.length > 0;

  return (
    <RouteWrapper>
      <RouteGrowContent>
        <RouteTitle text="Напоминания" />
        <AddReminderForm />
        <AddSharedReminderForm />

        {isLoading ? (
          <p className="text-primary">Загрузка...</p>
        ) : !isSharedLength && !isRemindersLength ? (
          <p className="text-primary">У вас пока нет напоминаний</p>
        ) : (
          <>
            <div className="mb-3 flex flex-col gap-3">
              {isSharedLength && (
                <h2 className="text-primary text-xl font-semibold">
                  Входящие напоминания
                </h2>
              )}

              {remindersData.sharedReminders
                .sort(
                  (a, b) =>
                    new Date(a.dueDate).getTime() -
                    new Date(b.dueDate).getTime()
                )
                .map((reminder: Reminder) => {
                  const localDate = format(
                    new Date(reminder.dueDate + 'Z'),
                    'dd.MM.yy HH:mm'
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
                <h2 className="text-primary text-xl font-semibold">
                  Напоминания
                </h2>
              )}

              {remindersData.reminders
                .sort(
                  (a, b) =>
                    new Date(a.dueDate).getTime() -
                    new Date(b.dueDate).getTime()
                )
                .map((reminder: Reminder) => {
                  const localDate = format(
                    new Date(reminder.dueDate),
                    'dd.MM.yy HH:mm'
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
          </>
        )}
      </RouteGrowContent>
      <BackButton />
    </RouteWrapper>
  );
};

export default Reminders;
