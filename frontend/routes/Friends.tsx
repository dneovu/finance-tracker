import AddFriendForm from '../components/AddFriendForm';
import useFriends from '../hooks/useFriends';
import FriendsSection from '../components/FriendsSection';

const Friends = () => {
  const { friendsData } = useFriends();
  const { friends, outgoingRequests, incomingRequests } = friendsData;

  return (
    <div>
      <AddFriendForm />
      {friends.length === 0 &&
      outgoingRequests.length === 0 &&
      incomingRequests.length === 0 ? (
        <p>У вас пока нет друзей или заявок.</p>
      ) : (
        <>
          <FriendsSection
            title="Входящие заявки"
            friends={incomingRequests}
            isIncomingRequest
          />
          <FriendsSection title="Исходящие заявки" friends={outgoingRequests} />
          <FriendsSection title="Друзья" friends={friends} />
        </>
      )}
    </div>
  );
};

export default Friends;
