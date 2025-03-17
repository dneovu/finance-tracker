import { useState } from 'react';
import useProfile from '../hooks/useProfile';
import useAuth from '../hooks/useAuth';
import SubmitButton from './common/SubmitButton';

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
    <div className="flex w-fit flex-col gap-5">
      {user && (
        <img src={user.logo} alt="avatar" className="h-32 w-32 rounded-full" />
      )}
      <input
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        name="avatarInput"
        id="avatarInput"
        className="hover:file:bg-primary file:bg-secondary w-fit text-stone-500 transition-all file:mr-5 file:border-[1px] file:px-3 file:py-1 file:text-stone-700 file:transition-all hover:cursor-pointer hover:file:cursor-pointer"
        onChange={handleInputFile}
      />
      <SubmitButton text="Загрузить" onClick={handleUploadButton} />
    </div>
  );
};

export default ManageAvatar;
