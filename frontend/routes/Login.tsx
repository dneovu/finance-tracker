import { FormEvent, useState } from 'react';
import isAuthInputValid from '../utils/isAuthInputValid';
import InputWithValidation from '../components/common/InputWithValidation';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../components/wrappers/AuthLayout';
import { useNavigate } from 'react-router';
import notify from '../utils/notify';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticating } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const res = await login(username, password);
    if (res.status === 'error') {
      setUsername('');
      setPassword('');
      notify.error(res.message);
    } else {
      navigate('/');
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-bold">Вход в систему</h1>
      <form className="flex flex-col gap-2" onSubmit={handleLogin}>
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
        <button
          className="bg-secondary text-background hover:bg-primary mt-3 cursor-pointer rounded-md py-2 font-bold transition-all hover:shadow-sm hover:shadow-slate-300 disabled:cursor-default disabled:bg-slate-300 disabled:text-slate-400 disabled:hover:shadow-none"
          type="submit"
          disabled={
            !isAuthInputValid(username) ||
            !isAuthInputValid(password) ||
            isAuthenticating
          }
        >
          {isAuthenticating ? 'Загрузка...' : 'Войти'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
