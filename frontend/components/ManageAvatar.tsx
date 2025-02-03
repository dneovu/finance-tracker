import { useState } from 'react';
import useProfile from '../hooks/useProfile';
import useAuth from '../hooks/useAuth';

const ManageAvatar = () => {
  const { user } = useAuth();
  const { uploadAvatar } = useProfile();
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
        accept="image/png, image/jpg, image/jpeg"
        name="avatarInput"
        id="avatarInput"
        className="text-sm text-stone-500 file:mr-5 file:border-[1px] file:bg-stone-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700"
        onChange={handleInputFile}
      />
      <button
        className="w-fit cursor-pointer text-green-500"
        onClick={handleUploadButton}
      >
        Изменить аватар
      </button>
    </>
  );
};

export default ManageAvatar;
