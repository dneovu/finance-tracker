import { FormEvent, useState } from 'react';
import useProfile from '../hooks/useProfile';
import AuthInput from './AuthInput';
import isAuthInputValid from '../utils/isAuthInputValid';

const ChangeUsernameForm = () => {
  const { changeUsername } = useProfile();
  const [newUsername, setNewUsername] = useState('');

  const handleUpdateUsername = async (e: FormEvent) => {
    e.preventDefault();

    const res = await changeUsername(newUsername);

    if (res.status === 'error') {
      setNewUsername('');
    }

    alert(res.message);
  };

  return (
    <form className="flex w-fit flex-col gap-3" onSubmit={handleUpdateUsername}>
      <h2>Изменение логина</h2>
      <AuthInput
        labelName="Новый логин"
        id="newUsername"
        type="text"
        value={newUsername}
        setValue={setNewUsername}
        isValid={isAuthInputValid}
      />
      <button type="submit" className="w-fit cursor-pointer text-red-600">
        Изменить логин
      </button>
    </form>
  );
};

export default ChangeUsernameForm;
