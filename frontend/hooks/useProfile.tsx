import { useContext } from 'react';
import ProfileContext from '../context/ProfileContext';

const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile должен использоваться внутри ProfileProvider');
  }
  return context;
};

export default useProfile;
