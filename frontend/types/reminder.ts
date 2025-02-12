export interface Reminder {
  id: number;
  amount: number;
  name: string;
  dueDate: string;
  isActive: boolean;
}

export type Reminders = Reminder[];

export interface RemindersData {
  reminders: Reminders;
  sharedReminders: Reminders;
}