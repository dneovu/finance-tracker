import { FormEvent, useState } from 'react';
import useFriends from '../hooks/useFriends';

const AddFriendForm = () => {
  const { sendFriendRequest } = useFriends();
  const [friendSearch, setFriendSearch] = useState('');

  const searchHandler = async (e: FormEvent) => {
    e.preventDefault();

    await sendFriendRequest(friendSearch);
  };

  return (
    <div className="flex w-fit flex-col">
      <h2 className="font-bold">Добавить друга</h2>
      <form className="flex flex-col gap-3" onSubmit={searchHandler}>
        <div className="flex flex-col">
          <label htmlFor="add-category">Логин пользователя</label>
          <input
            className="border-2 border-slate-700 px-2 py-1 focus:outline-none"
            type="text"
            name="friend-search"
            id="friend-search"
            minLength={6}
            placeholder="Введите логин"
            value={friendSearch}
            onChange={(e) => setFriendSearch(e.target.value)}
          />
        </div>
        <button
          className="mt-4 cursor-pointer rounded-md border-2 border-slate-700 bg-slate-50 px-4 py-2"
          type="submit"
        >
          Добавить
        </button>
      </form>
    </div>
  );
};

export default AddFriendForm;
