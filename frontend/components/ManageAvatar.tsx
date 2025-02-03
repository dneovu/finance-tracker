import { useState } from 'react';
import useUser from '../hooks/useUser';

const ManageAvatar = () => {
  const { user, uploadAvatar } = useUser();
  const [file, setFile] = useState<File | null>(null);

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadButton = async () => {
    if (file) {
      const res = await uploadAvatar(file);
      console.log(res);
    }
  };

  return (
    <>
      {user && <img src={user.logo} alt="avatar" className="h-32 w-32" />}
      <input
        type="file"
        name="avatarInput"
        id="avatarInput"
        className="border-2"
        onChange={handleInputFile}
      />
      <button
        className="cursor-pointer text-green-500"
        onClick={handleUploadButton}
      >
        Изменить аватар
      </button>
    </>
  );
};

export default ManageAvatar;
