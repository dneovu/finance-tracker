import { useState } from 'react';
import useFriends from '../hooks/useFriends';
import { Friend } from '../types';
import useReminders from '../hooks/useReminders';

const AddSharedReminderForm = () => {
  const { friendsData } = useFriends();
  const { addSharedReminder } = useReminders();
  const [name, setName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<
    Record<number, number>
  >({});

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
    console.log(res);
  };

  return (
    <div className="w-fit rounded-md border border-gray-300 p-4">
      <h2 className="text-lg font-bold">Добавить общее напоминание</h2>
      <form className="mt-2 flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="reminder-name">Название</label>
          <input
            id="reminder-name"
            type="text"
            maxLength={20}
            className="border px-2 py-1 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="reminder-date">Дата и время</label>
          <input
            id="reminder-date"
            type="datetime-local"
            className="border px-2 py-1 focus:outline-none"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={getMinDateTime()} // блокируем выбор прошлого времени
          />
        </div>

        <div className="flex flex-col">
          <label>Выберите друзей:</label>
          {friendsData.friends.length === 0 ? (
            <p className="text-gray-500">У вас нет друзей</p>
          ) : (
            friendsData.friends.map((friend: Friend) => (
              <div key={friend.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`friend-${friend.id}`}
                  checked={friend.id in selectedFriends}
                  onChange={() => toggleFriendSelection(friend.id)}
                />
                <label htmlFor={`friend-${friend.id}`}>{friend.username}</label>

                {friend.id in selectedFriends && (
                  <input
                    type="number"
                    min="1"
                    placeholder="Сумма"
                    className="w-24 border px-2 py-1"
                    value={selectedFriends[friend.id]}
                    onChange={(e) =>
                      handleAmountChange(friend.id, Number(e.target.value))
                    }
                  />
                )}
              </div>
            ))
          )}
        </div>

        <button
          type="submit"
          className="mt-4 rounded-md border bg-blue-500 px-4 py-2 text-white"
        >
          Создать
        </button>
      </form>
    </div>
  );
};

export default AddSharedReminderForm;
