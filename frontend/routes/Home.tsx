import useAuth from '../hooks/useAuth';
import RouteWrapper from '../components/wrappers/RouteWrapper';
import HomeLink from '../components/common/HomeLink';

const Home = () => {
  const { user, isUserLoading } = useAuth();

  if (!isUserLoading)
    return (
      <RouteWrapper>
        <div className="flex flex-col gap-6 px-5">
          {user ? (
            <>
              <h1 className="text-primary mb-7 text-3xl tracking-wide">
                Добро пожаловать,&nbsp;
                <span className="font-bold tracking-widest">
                  {user.username}
                </span>
              </h1>
              <HomeLink route="/profile" text="Профиль" />
              <HomeLink route="/friends" text="Друзья" />
              <HomeLink route="/categories" text="Категории" />
              <HomeLink route="/transactions" text="Транзакции" />
              <HomeLink route="/reminders" text="Напоминания" />

              {/* <button
                className="w-fit cursor-pointer underline"
                onClick={logout}
              >
                Выйти
              </button> */}
            </>
          ) : (
            <div className="flex flex-col gap-5">
              <h1 className="text-primary mb-7 text-3xl tracking-wide">
                Трекер финансов
              </h1>
              <HomeLink route="/login" text="Войти" />
              <HomeLink route="/register" text="Регистрация" />
            </div>
          )}
        </div>
      </RouteWrapper>
    );
};

export default Home;
