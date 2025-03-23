import { FormEvent, useState } from 'react';
import isAuthInputValid from '../utils/isAuthInputValid';
import useAuth from '../hooks/useAuth';
import InputWithValidation from '../components/common/InputWithValidation';
import AuthLayout from '../components/wrappers/AuthLayout';
import { useNavigate } from 'react-router';
import notify from '../utils/notify';

const Register = () => {
  const { register, isAuthenticating } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const arePasswordsMatching = (password: string, confirmPassword: string) => {
    return password === confirmPassword && isAuthInputValid(confirmPassword);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    const res = await register(username, password);
    console.log(res);
    if (res.status === 'error') {
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      notify.error(res.message);
    } else {
      navigate('/login');
      notify.success(res.message);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-bold">Регистрация</h1>
      <form className="flex flex-col gap-2" onSubmit={handleRegister}>
        <InputWithValidation
          labelName="Логин"
          id="username"
          type="text"
          value={username}
          setValue={setUsername}
          isValid={isAuthInputValid}
        />
        <InputWithValidation
          labelName="Пароль"
          id="password"
          type="password"
          value={password}
          setValue={setPassword}
          isValid={isAuthInputValid}
        />
        <InputWithValidation
          labelName="Подтвердите пароль"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          isValid={() => arePasswordsMatching(password, confirmPassword)}
        />
        <button
          className="bg-secondary text-background hover:bg-primary mt-3 cursor-pointer rounded-md py-2 font-bold transition-all hover:shadow-sm hover:shadow-slate-300 disabled:cursor-default disabled:bg-slate-300 disabled:text-slate-400 disabled:hover:shadow-none"
          type="submit"
          disabled={
            !isAuthInputValid(username) ||
            !isAuthInputValid(password) ||
            !arePasswordsMatching(password, confirmPassword) ||
            isAuthenticating
          }
        >
          {isAuthenticating ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
