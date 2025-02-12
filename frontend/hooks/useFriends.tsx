import { useContext } from 'react';
import FriendContext from '../context/FriendContext';

const useFriends = () => {
  const context = useContext(FriendContext);
  if (!context) {
    throw new Error('useFriends должен использоваться внутри FriendProvider');
  }
  return context;
};

export default useFriends;
