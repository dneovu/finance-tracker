import { Friend } from '../types';
import FriendItem from './listItems/FriendItem';

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
    <section className="mb-3 flex flex-col gap-3">
      {title && (
        <h2 className="text-primary mb-1 text-xl font-bold tracking-wider">
          {title}
        </h2>
      )}
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
