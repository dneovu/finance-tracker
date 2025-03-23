import { FormEvent, useState } from 'react';
import useProfile from '../../hooks/useProfile';
import InputWithValidation from '../common/InputWithValidation';
import isAuthInputValid from '../../utils/isAuthInputValid';
import DropdownForm from './DropdownForm';
import notify from '../../utils/notify';

const ChangeUsernameForm = () => {
  const { changeUsername, isChangingUsername } = useProfile();
  const [newUsername, setNewUsername] = useState('');
  const [isOpen, setIsOpen] = useState(false); // отображение формы

  const handleUpdateUsername = async (e: FormEvent) => {
    e.preventDefault();

    const res = await changeUsername(newUsername);

    if (res.status === 'error') {
      setNewUsername('');
      notify.error(res.message);
    } else {
      notify.success(res.message);
    }
  };

  return (
    <DropdownForm
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleSubmitForm={handleUpdateUsername}
      isButtonLoading={isChangingUsername}
      title="Изменить логин"
      buttonText="Сохранить"
    >
      <InputWithValidation
        labelName="Новый логин"
        id="newUsername"
        type="text"
        value={newUsername}
        setValue={setNewUsername}
        isValid={isAuthInputValid}
      />
    </DropdownForm>
  );
};

export default ChangeUsernameForm;
