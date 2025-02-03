import ChangeUsernameForm from '../components/ChangeUsernameForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import ManageAvatar from '../components/ManageAvatar';

const Profile = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="font-bold">Профиль</h1>
      <div className="flex flex-wrap gap-16">
        <ChangePasswordForm />
        <ChangeUsernameForm />
      </div>
      <ManageAvatar />
    </div>
  );
};

export default Profile;
