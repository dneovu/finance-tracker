import { Friend } from '../types';
import FriendItem from './FriendItem';

interface FriendsSectionProps {
  title: string;
  friends: Friend[];
  isIncomingRequest?: boolean;
}

const FriendsSection = ({
  title,
  friends,
  isIncomingRequest,
}: FriendsSectionProps) => {
  if (friends.length === 0) return null;

  return (
    <section>
      <h2>{title}</h2>
      {friends.map((friend) => (
        <FriendItem
          friend={friend}
          isIncomingRequest={isIncomingRequest}
          key={friend.id}
        />
      ))}
    </section>
  );
};

export default FriendsSection;
