import ChangeUsernameForm from '../components/ChangeUsernameForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import ManageAvatar from '../components/ManageAvatar';
import RouteWrapper from '../components/RouteWrapper';
import useAuth from '../hooks/useAuth';
import RouteTitle from '../components/RouteTitle';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <RouteWrapper>
      <div className="flex flex-col gap-6">
        <RouteTitle text={user?.username ?? '...'} />
        <ManageAvatar />
        <div className="flex flex-wrap">
          <ChangeUsernameForm />
          <ChangePasswordForm />
        </div>
        <button className='w-fit text-primary text-lg hover:text-secondary hover:italic cursor-pointer' onClick={() => logout()}>Выйти</button>
      </div>
    </RouteWrapper>
  );
};

export default Profile;
