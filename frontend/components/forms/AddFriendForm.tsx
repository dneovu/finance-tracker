import { FormEvent, useState } from 'react';
import useFriends from '../../hooks/useFriends';
import DropdownForm from './DropdownForm';
import InputWithValidation from '../common/InputWithValidation';

const AddFriendForm = () => {
  const { sendFriendRequest, isSendingRequest } = useFriends();
  const [friendSearch, setFriendSearch] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const searchHandler = async (e: FormEvent) => {
    e.preventDefault();
    await sendFriendRequest(friendSearch);
  };

  return (
    <DropdownForm
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleSubmitForm={searchHandler}
      title="Добавить друга"
      buttonText="Добавить"
      isButtonLoading={isSendingRequest}
    >
      <InputWithValidation
        labelName="Логин пользователя"
        id="friend-search"
        type="text"
        value={friendSearch}
        setValue={setFriendSearch}
        minLength={6}
        isValid={() => friendSearch.length >= 6}
      />
    </DropdownForm>
  );
};

export default AddFriendForm;
