import { Reminder } from '../../types/reminder';

interface ReminderItemProps {
  reminder: Reminder;
  deactivateReminder: (id: number, isShared: boolean) => void;
  isShared: boolean;
  localDate: string;
}

const ReminderItem = ({
  reminder,
  deactivateReminder,
  isShared,
  localDate,
}: ReminderItemProps) => {
  return (
    <div className="bg-primary hover:border-secondary text-background shadow-secondary group flex h-fit max-w-[30rem] items-center justify-between gap-4 rounded-lg border border-gray-300 p-4 tracking-wide shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col">
        <p className="text-lg font-semibold">{reminder.name}</p>
        <p className="text-sm">Сумма: {reminder.amount} ₽</p>
        <p className="text-sm">{localDate}</p>
      </div>
      <button
        onClick={() => deactivateReminder(reminder.id, isShared)}
        className="hover:text-secondary mt-2 cursor-pointer transition-all"
      >
        Удалить
      </button>
    </div>
  );
};

export default ReminderItem;
