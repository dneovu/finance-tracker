import { useState } from 'react';
import useFriends from '@/hooks/useFriends';
import { Friend } from '@/types';
import useReminders from '@/hooks/useReminders';
import DropdownForm from './DropdownForm';
import getMinDateTime from '@/utils/getMinDateTime';
import DateTimeInput from '../common/DateTimeInput';
import notify from '@/utils/notify';
import AmountInput from '../common/AmountInput';

const AddSharedReminderForm = () => {
  const { friendsData } = useFriends();
  const { addSharedReminder, isAddingSharedReminder } = useReminders();
  const [name, setName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<
    Record<number, number>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  const [dueDateTime, setDueDateTime] = useState(getMinDateTime());

  // добавление/удаление выбранного друга
  const toggleFriendSelection = (friendId: number) => {
    setSelectedFriends((prev) => {
      const newSelection = { ...prev };
      if (newSelection[friendId] !== undefined) {
        delete newSelection[friendId];
      } else {
        newSelection[friendId] = 0;
      }
      return newSelection;
    });
  };

  const handleAmountChange = (friendId: number, amount: number) => {
    setSelectedFriends((prev) => ({
      ...prev,
      [friendId]: amount,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      name,
      dueDateTime,
      sharedReminders: selectedFriends,
    });

    const res = await addSharedReminder(
      name,
      new Date(dueDateTime),
      selectedFriends
    );

    if (res.status === 'success') {
      setName('');
      setDueDateTime(getMinDateTime());
      setSelectedFriends({});
      notify.success(res.message);
    } else {
      notify.error(res.message);
    }
    console.log(res);
  };

  return (
    <DropdownForm
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleSubmitForm={handleSubmit}
      isButtonLoading={isAddingSharedReminder}
      title="Создать общее напоминание"
      buttonText="Отправить"
    >
      <div className="flex flex-col">
        <label htmlFor="reminder-name">Название</label>
        <input
          id="reminder-name"
          type="text"
          required
          minLength={1}
          maxLength={20}
          className="border-primary rounded-sm border-2 px-2 py-1 focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <DateTimeInput
        id="shared-reminder-date-time"
        value={dueDateTime}
        setValue={setDueDateTime}
        minDateTime={getMinDateTime()}
        labelText="Дата и время"
      />

      <div className="flex flex-col gap-2">
        <label>Выберите друзей:</label>
        {friendsData.friends.length === 0 ? (
          <p className="text-gray-500">У вас нет друзей</p>
        ) : (
          friendsData.friends.map((friend: Friend) => (
            <div key={friend.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`friend-${friend.id}`}
                  checked={friend.id in selectedFriends}
                  onChange={() => toggleFriendSelection(friend.id)}
                  className="peer hidden"
                />
                <label
                  htmlFor={`friend-${friend.id}`}
                  className="flex cursor-pointer items-center gap-2 select-none"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-gray-400 transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500">
                    {friend.id in selectedFriends && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="h-4 w-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M20.285 5.285a1 1 0 0 1 0 1.414l-10 10a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L9 14.586l9.293-9.293a1 1 0 0 1 1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                  {friend.username}
                </label>
              </div>

              {friend.id in selectedFriends && (
                <AmountInput
                  amount={selectedFriends[friend.id].toString()}
                  setAmount={(amount) =>
                    handleAmountChange(friend.id, Number(amount))
                  }
                />
              )}
            </div>
          ))
        )}
      </div>
    </DropdownForm>
  );
};

export default AddSharedReminderForm;
