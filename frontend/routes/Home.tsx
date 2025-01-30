import { NavLink } from 'react-router';
import useUser from '../hooks/useUser';

const Home = () => {
  const { user, loading, logout } = useUser();

  if (!loading)
    return (
      <div className="flex flex-col gap-3">
        {user ? (
          <>
            <h2>
              Добро пожаловать,
              <span className="font-bold">{user.username}</span>
            </h2>
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
