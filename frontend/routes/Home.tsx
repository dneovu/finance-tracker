import { NavLink } from 'react-router';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { user, loading, logout } = useAuth();

  if (!loading)
    return (
      <div className="flex flex-col gap-3">
        {user ? (
          <>
            <h2>
              Добро пожаловать,&nbsp;
              <span className="font-bold">{user.username}</span>
            </h2>
            <NavLink className="w-fit underline" to="/profile" end>
              Профиль
            </NavLink>
            <button className="w-fit cursor-pointer underline" onClick={logout}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <NavLink className="w-fit underline" to="/login" end>
              Войти
            </NavLink>
            <NavLink className="w-fit underline" to="/register" end>
              Зарегистрироваться
            </NavLink>
          </>
        )}
      </div>
    );
};

export default Home;
