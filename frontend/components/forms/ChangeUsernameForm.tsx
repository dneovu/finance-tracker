import { FormEvent, useState } from 'react';
import useProfile from '../../hooks/useProfile';
import InputWithValidation from '../common/InputWithValidation';
import isAuthInputValid from '../../utils/isAuthInputValid';
import DropdownForm from './DropdownForm';

const ChangeUsernameForm = () => {
  const { changeUsername } = useProfile();
  const [newUsername, setNewUsername] = useState('');
  const [isOpen, setIsOpen] = useState(false); // отображение формы

  const handleUpdateUsername = async (e: FormEvent) => {
    e.preventDefault();

    const res = await changeUsername(newUsername);

    if (res.status === 'error') {
      setNewUsername('');
    }

    alert(res.message);
  };

  return (
    <DropdownForm
      isOpen={isOpen}
      setIsOpen={() => setIsOpen((prev) => !prev)}
      handleSubmitForm={handleUpdateUsername}
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
