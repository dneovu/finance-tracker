import { FormEvent, useState } from 'react';
import isInputValid from '../utils/isInputValid';
import useUser from '../hooks/useUser';
import AuthInput from '../components/AuthInput';
import AuthLayout from '../components/AuthLayout';
import { useNavigate } from 'react-router';

const Register = () => {
  const { loading, register } = useUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const arePasswordsMatching = (password: string, confirmPassword: string) => {
    return password === confirmPassword && isInputValid(confirmPassword);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    const res = await register(username, password);
    if (res.status === 'success') {
      navigate('/login');
    }
  };

  if (!loading)
    return (
      <AuthLayout>
        <h1 className="font-bold">Регистрация</h1>
        <form className="flex flex-col gap-2" onSubmit={handleRegister}>
          <AuthInput
            labelName="Логин"
            id="username"
            type="text"
            value={username}
            setValue={setUsername}
            isValid={isInputValid}
          />
          <AuthInput
            labelName="Пароль"
            id="password"
            type="password"
            value={password}
            setValue={setPassword}
            isValid={isInputValid}
          />
          <AuthInput
            labelName="Подтвердите пароль"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            isValid={() => arePasswordsMatching(password, confirmPassword)}
          />
          <button
            className="mt-3 cursor-pointer rounded-md bg-slate-700 py-2 font-bold text-slate-50 transition-all hover:shadow-lg hover:shadow-slate-300 disabled:cursor-default disabled:bg-slate-200 disabled:hover:shadow-none"
            type="submit"
            disabled={
              !isInputValid(username) ||
              !isInputValid(password) ||
              !arePasswordsMatching(password, confirmPassword)
            }
          >
            Зарегистрироваться
          </button>
        </form>
      </AuthLayout>
    );
};

export default Register;
