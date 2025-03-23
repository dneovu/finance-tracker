import { FormEvent, useState } from 'react';
import useProfile from '../../hooks/useProfile';
import InputWithValidation from '../common/InputWithValidation';
import isAuthInputValid from '../../utils/isAuthInputValid';
import DropdownForm from './DropdownForm';
import notify from '../../utils/notify';

const ChangePasswordForm = () => {
  const { changePassword, isChangingPassword } = useProfile();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false); // отображение формы

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();

    const res = await changePassword(currentPassword, newPassword);

    if (res.status === 'error') {
      setCurrentPassword('');
      setNewPassword('');
      notify.error(res.message);
    } else {
      notify.success(res.message);
    }
  };

  return (
    <DropdownForm
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleSubmitForm={handleUpdatePassword}
      isButtonLoading={isChangingPassword}
      title="Изменить пароль"
      buttonText="Сохранить"
    >
      <InputWithValidation
        labelName="Текущий пароль"
        id="currentPassword"
        type="password"
        value={currentPassword}
        setValue={setCurrentPassword}
        isValid={isAuthInputValid}
      />
      <InputWithValidation
        labelName="Новый пароль"
        id="newPassword"
        type="password"
        value={newPassword}
        setValue={setNewPassword}
        isValid={isAuthInputValid}
      />
    </DropdownForm>
  );
};

export default ChangePasswordForm;
