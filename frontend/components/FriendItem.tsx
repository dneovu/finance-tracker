import useFriends from '../hooks/useFriends';
import { Friend } from '../types';

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
    const className = 'cursor-pointer';
    if (status === 0) {
      return isIncomingRequest ? (
        <div className="flex w-fit flex-col">
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
    <div>
      <p>Имя: {friend.username}</p>
      <p>
        Логотип: <img src={friend.logo} width="100" alt="Friend's logo" />
      </p>
      {buttons}
    </div>
  );
};

export default FriendItem;
