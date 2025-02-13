import { useState } from 'react';
import useFriends from '../hooks/useFriends';
import { Friend } from '../types';
import useReminders from '../hooks/useReminders';
import DropdownForm from './DropdownForm';

const AddSharedReminderForm = () => {
  const { friendsData } = useFriends();
  const { addSharedReminder } = useReminders();
  const [name, setName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<
    Record<number, number>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  //  форматируем для `min` в `datetime-local`
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // коррекция на часовой пояс
    return now.toISOString().slice(0, 16); // формат "YYYY-MM-DDTHH:MM"
  };

  const [dueDate, setDueDate] = useState(getMinDateTime());

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
      dueDate,
      sharedReminders: selectedFriends,
    });

    const res = await addSharedReminder(
      name,
      new Date(dueDate),
      selectedFriends
    );

    if (res.status === 'success') {
      setName('');
      setDueDate(getMinDateTime());
      setSelectedFriends({});
    }
    console.log(res);
  };

  return (
    <DropdownForm
      isOpen={isOpen}
      setIsOpen={() => setIsOpen((prev) => !prev)}
      handleSubmitForm={handleSubmit}
      title="Добавить общее напоминание"
      buttonText="Создать"
    >
      <div className="flex flex-col">
        <label htmlFor="reminder-name">Название</label>
        <input
          id="reminder-name"
          type="text"
          required
          minLength={1}
          maxLength={20}
          className="border-primary border-2 px-2 py-1 focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="reminder-date">Дата и время</label>
        <input
          id="reminder-date"
          type="datetime-local"
          className="border-primary border-2 px-2 py-1 focus:outline-none"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={getMinDateTime()} // блокируем выбор прошлого времени
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Выберите друзей:</label>
        {friendsData.friends.length === 0 ? (
          <p className="text-gray-500">У вас нет друзей</p>
        ) : (
          friendsData.friends.map((friend: Friend) => (
            <div key={friend.id} className="flex items-center gap-1">
              <input
                type="checkbox"
                id={`friend-${friend.id}`}
                checked={friend.id in selectedFriends}
                onChange={() => toggleFriendSelection(friend.id)}
              />
              <label htmlFor={`friend-${friend.id}`}>{friend.username}</label>

              {friend.id in selectedFriends && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Сумма"
                    className="border-primary w-24 border-2 px-2 py-1 focus:outline-none"
                    value={selectedFriends[friend.id]}
                    onChange={(e) =>
                      handleAmountChange(friend.id, Number(e.target.value))
                    }
                  />
                  <span>₽</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </DropdownForm>
  );
};

export default AddSharedReminderForm;
