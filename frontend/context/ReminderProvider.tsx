import { useEffect, useState } from 'react';
import {
  AddReminderResponse,
  ApiResponse,
  Friend,
  ProviderProps,
  RemindersResponse,
} from '../types';
import ReminderContext from './ReminderContext';
import { Reminder, RemindersData } from '../types/reminder';
import api from '../utils/api';
import { AxiosResponse } from 'axios';
import useAuth from '../hooks/useAuth';
import handleProviderError from '../utils/handleProviderError';

const ReminderProvider = ({ children }: ProviderProps) => {
  const { isUserAuthenticated } = useAuth();
  const [remindersData, setRemindersData] = useState<RemindersData>({
    reminders: [],
    sharedReminders: [],
  });
  // состоянния загрузки
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [isAddingSharedReminder, setIsAddingSharedReminder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setIsLoading(true);
        const res: AxiosResponse<RemindersResponse> =
          await api.get('/reminders');
        if (res.data.reminders) {
          setRemindersData({
            reminders: res.data.reminders ? res.data.reminders : [],
            sharedReminders: res.data.shared_reminders
              ? res.data.shared_reminders
              : [],
          });
        }
        console.log(res.data);
      } catch (error) {
        return handleProviderError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReminders();
  }, [isUserAuthenticated]);

  const addReminder = async (
    amount: Reminder['amount'],
    name: Reminder['name'],
    dueDate: Date
  ) => {
    try {
      setIsAddingReminder(true);
      // без сдвига в UTC
      const localDateTime = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate(),
        dueDate.getHours(),
        dueDate.getMinutes(),
        dueDate.getSeconds()
      );

      const res: AxiosResponse<AddReminderResponse> = await api.post(
        '/reminders/add-reminder',
        {
          amount,
          name,
          dueDate: localDateTime.toISOString().slice(0, 19), // обрезаем до "YYYY-MM-DDTHH:mm:ss"
        }
      );
      const newReminder = res.data.reminder;
      if (newReminder) {
        // добавление напоминания в стейт
        setRemindersData((prev) => ({
          ...prev,
          reminders: [...prev.reminders, newReminder],
        }));
      }
      console.log(res.data);
      return res.data;
    } catch (error) {
      return handleProviderError(error);
    } finally {
      setIsAddingReminder(false);
    }
  };

  const addSharedReminder = async (
    name: Reminder['name'],
    dueDate: Date,
    sharedReminders: {
      [friendId: Friend['id']]: Reminder['amount'];
    }
  ) => {
    try {
      setIsAddingSharedReminder(true);
      // без сдвига в UTC
      const localDateTime = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate(),
        dueDate.getHours(),
        dueDate.getMinutes(),
        dueDate.getSeconds()
      );

      const res: AxiosResponse<AddReminderResponse> = await api.post(
        '/reminders/add-shared-reminder',
        {
          name,
          dueDate: localDateTime.toISOString().slice(0, 19), // обрезаем до "YYYY-MM-DDTHH:mm:ss"
          sharedReminders,
        }
      );
      const newSharedReminder = res.data.reminder;
      if (newSharedReminder) {
        // добавление напоминания в стейт
        setRemindersData((prev) => ({
          ...prev,
          sharedReminders: [...prev.sharedReminders, newSharedReminder],
        }));
      }
      console.log(res.data);
      return res.data;
    } catch (error) {
      return handleProviderError(error);
    } finally {
      setIsAddingSharedReminder(false);
    }
  };

  const deactivateReminder = async (id: Reminder['id'], isShared: boolean) => {
    try {
      const res: AxiosResponse<ApiResponse> = await api.post(
        '/reminders/deactivate-reminder',
        { id }
      );

      setRemindersData((prev) => ({
        ...prev,
        sharedReminders: isShared
          ? [...prev.sharedReminders.filter((r) => r.id !== id)]
          : prev.sharedReminders,
        reminders: !isShared
          ? [...prev.reminders.filter((r) => r.id !== id)]
          : prev.reminders,
      }));

      console.log(res.data);
      return res.data;
    } catch (error) {
      return handleProviderError(error);
    }
  };

  return (
    <ReminderContext.Provider
      value={{
        remindersData,
        addReminder,
        addSharedReminder,
        deactivateReminder,
        isAddingReminder,
        isAddingSharedReminder,
        isLoading,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
};

export default ReminderProvider;
