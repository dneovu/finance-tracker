import { createContext } from 'react';
import { ApiResponse, Friend } from '../types';
import { AddReminderResponse } from '../types';
import { Reminder, RemindersData } from '../types/reminder';

interface ReminderContextType {
  remindersData: RemindersData;
  addReminder: (
    amount: Reminder['amount'],
    name: Reminder['name'],
    dueDate: Date
  ) => Promise<AddReminderResponse>;
  addSharedReminder: (
    name: Reminder['name'],
    dueDate: Date,
    sharedReminders: {
      [friendId: Friend['id']]: Reminder['amount'];
    }
  ) => Promise<AddReminderResponse>;
  deactivateReminder: (
    id: Reminder['id'],
    isShared: boolean
  ) => Promise<ApiResponse>;
  isAddingReminder: boolean;
  isAddingSharedReminder: boolean;
  isLoading: boolean;
}

const reminderContextReject = async () =>
  Promise.reject('ReminderContext not provided');

const defaultCategoryContext: ReminderContextType = {
  remindersData: {
    reminders: [],
    sharedReminders: [],
  },
  addReminder: reminderContextReject,
  addSharedReminder: reminderContextReject,
  deactivateReminder: reminderContextReject,
  isAddingReminder: false,
  isAddingSharedReminder: false,
  isLoading: false,
};

const ReminderContext = createContext<ReminderContextType>(
  defaultCategoryContext
);

export default ReminderContext;
