import { FormEvent, useState } from 'react';
import useFriends from '../../hooks/useFriends';
import DropdownForm from './DropdownForm';

const AddFriendForm = () => {
  const { sendFriendRequest } = useFriends();
  const [friendSearch, setFriendSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const searchHandler = async (e: FormEvent) => {
    e.preventDefault();
    await sendFriendRequest(friendSearch);
  };

  return (
    <DropdownForm
      isOpen={isOpen}
      setIsOpen={() => setIsOpen((prev) => !prev)}
      handleSubmitForm={searchHandler}
      title="Добавить друга"
      buttonText="Добавить"
    >
      <div className="flex flex-col">
        <label htmlFor="friend-search">Логин пользователя</label>
        <input
          className={`border-2 px-2 py-1 focus:outline-none ${
            friendSearch.length >= 6 ? 'border-secondary' : 'border-primary'
          }`}
          type="text"
          name="friend-search"
          id="friend-search"
          required
          minLength={6}
          value={friendSearch}
          onChange={(e) => setFriendSearch(e.target.value)}
        />
      </div>
    </DropdownForm>
  );
};

export default AddFriendForm;
