import { FormEvent, useState } from 'react';
import isAuthInputValid from '../utils/isAuthInputValid';
import AuthInput from '../components/AuthInput';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import { useNavigate } from 'react-router';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const res = await login(username, password);
    if (res.status === 'error') {
      setUsername('');
      setPassword('');
    } else {
      navigate('/');
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-bold">Вход в систему</h1>
      <form className="flex flex-col gap-2" onSubmit={handleLogin}>
        <AuthInput
          labelName="Логин"
          id="username"
          type="text"
          value={username}
          setValue={setUsername}
          isValid={isAuthInputValid}
        />
        <AuthInput
          labelName="Пароль"
          id="password"
          type="password"
          value={password}
          setValue={setPassword}
          isValid={isAuthInputValid}
        />
        <button
          className="mt-3 cursor-pointer rounded-md bg-slate-700 py-2 font-bold text-slate-50 transition-all hover:shadow-lg hover:shadow-slate-300 disabled:cursor-default disabled:bg-slate-200 disabled:hover:shadow-none"
          type="submit"
          disabled={!isAuthInputValid(username) || !isAuthInputValid(password)}
        >
          Войти
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
