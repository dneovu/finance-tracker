import { useContext } from 'react';
import ReminderContext from '@/context/ReminderContext';

const useReminders = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error(
      'useReminders должен использоваться внутри ReminderProvider'
    );
  }
  return context;
};

export default useReminders;
