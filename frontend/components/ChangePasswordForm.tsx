import { FormEvent, useState } from 'react';
import useUser from '../hooks/useUser';
import AuthInput from './AuthInput';
import isAuthInputValid from '../utils/isAuthInputValid';

const ChangePasswordForm = () => {
  const { user, changePassword } = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();

    const res = await changePassword(currentPassword, newPassword);

    if (res.status === 'error') {
      setCurrentPassword('');
      setNewPassword('');
    }

    alert(res.message);
  };

  return (
    <>
      {user && (
        <form
          className="flex w-fit flex-col gap-3"
          onSubmit={handleUpdatePassword}
        >
          <h2>Изменение пароля</h2>
          <AuthInput
            labelName="Текущий пароль"
            id="currentPassword"
            type="password"
            value={currentPassword}
            setValue={setCurrentPassword}
            isValid={isAuthInputValid}
          />
          <AuthInput
            labelName="Новый пароль"
            id="newPassword"
            type="password"
            value={newPassword}
            setValue={setNewPassword}
            isValid={isAuthInputValid}
          />
          <button type="submit" className="w-fit cursor-pointer text-red-600">
            Изменить пароль
          </button>
        </form>
      )}
    </>
  );
};

export default ChangePasswordForm;
