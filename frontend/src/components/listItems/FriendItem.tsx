import useFriends from '@/hooks/useFriends';
import { Friend } from '@/types';

interface FriendItemProps {
  friend: Friend;
  isIncomingRequest?: boolean;
}

const FriendItem = ({ friend, isIncomingRequest = false }: FriendItemProps) => {
  const {
    acceptFriendRequest,
    cancelFriendRequest,
    declineFriendRequest,
    deleteFriend,
  } = useFriends();

  const statusToAdditionalButtons = (
    status: Friend['status'],
    isIncomingRequest = false
  ) => {
    const className =
      'cursor-pointer hover:text-secondary transition-colors duration-200';
    if (status === 0) {
      return isIncomingRequest ? (
        <div className="mt-2 flex gap-2">
          <button
            className={className}
            onClick={() => acceptFriendRequest(friend.id)}
          >
            Принять
          </button>
          <button
            className={className}
            onClick={() => declineFriendRequest(friend.id)}
          >
            Отклонить
          </button>
        </div>
      ) : (
        <button
          className={className}
          onClick={() => cancelFriendRequest(friend.id)}
        >
          Отменить
        </button>
      );
    } else if (status === 1) {
      return (
        <button className={className} onClick={() => deleteFriend(friend.id)}>
          Удалить
        </button>
      );
    }

    return null;
  };

  const buttons = statusToAdditionalButtons(friend.status, isIncomingRequest);

  return (
    <div className="bg-primary hover:border-secondary shadow-secondary group flex h-fit max-w-96 items-center gap-4 rounded-lg border border-gray-300 p-4 tracking-wide shadow-sm transition-all duration-300">
      <img
        src={friend.logo}
        width="100px"
        alt="Friend's logo"
        className="border-secondary rounded-full border-2"
      />

      <div className="flex flex-col">
        <p className="text-background mt-auto text-lg font-semibold">
          {friend.username}
        </p>
        {buttons}
      </div>
    </div>
  );
};

export default FriendItem;
