import ChangeUsernameForm from '../components/forms/ChangeUsernameForm';
import ChangePasswordForm from '../components/forms/ChangePasswordForm';
import ManageAvatar from '../components/ManageAvatar';
import RouteWrapper from '../components/wrappers/RouteWrapper';
import useAuth from '../hooks/useAuth';
import RouteTitle from '../components/RouteTitle';
import BackButton from '../components/common/BackButton';
import RouteGrowContent from '../components/wrappers/RouteGrowContent';

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
