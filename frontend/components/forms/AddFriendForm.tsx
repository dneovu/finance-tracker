import { FormEvent, useState } from 'react';
import useFriends from '../../hooks/useFriends';
import DropdownForm from './DropdownForm';
import InputWithValidation from '../common/InputWithValidation';
import notify from '../../utils/notify';

const AddFriendForm = () => {
  const { sendFriendRequest, isSendingRequest } = useFriends();
  const [friendSearch, setFriendSearch] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const searchHandler = async (e: FormEvent) => {
    e.preventDefault();
    const res = await sendFriendRequest(friendSearch);

    if (res.status === 'error') {
      notify.error(res.message);
    } else {
      setFriendSearch('');
    }
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
