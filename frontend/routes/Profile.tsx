import ChangeUsernameForm from '../components/ChangeUsernameForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import ManageAvatar from '../components/ManageAvatar';
import RouteWrapper from '../components/RouteWrapper';
import useAuth from '../hooks/useAuth';
import RouteTitle from '../components/RouteTitle';
import BackButton from '../components/BackButton';
import RouteGrowContent from '../components/RouteGrowContent';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <RouteWrapper>
      <RouteGrowContent className="gap-6">
        <RouteTitle text={user?.username ?? '...'} />
        <ManageAvatar />
        <div className="flex flex-wrap">
          <ChangeUsernameForm />
          <ChangePasswordForm />
        </div>
        <button
          className="text-primary hover:text-secondary w-fit cursor-pointer text-lg hover:italic"
          onClick={() => logout()}
        >
          Выйти
        </button>
      </RouteGrowContent>
      <BackButton />
    </RouteWrapper>
  );
};

export default Profile;
