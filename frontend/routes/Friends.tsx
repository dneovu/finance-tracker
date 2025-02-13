import AddFriendForm from '../components/AddFriendForm';
import useFriends from '../hooks/useFriends';
import FriendsSection from '../components/FriendsSection';
import RouteWrapper from '../components/RouteWrapper';
import RouteTitle from '../components/RouteTitle';

const Friends = () => {
  const { friendsData } = useFriends();
  const { friends, outgoingRequests, incomingRequests } = friendsData;

  return (
    <RouteWrapper>
      <RouteTitle text="Друзья" />
      <AddFriendForm />
      {friends.length === 0 &&
      outgoingRequests.length === 0 &&
      incomingRequests.length === 0 ? (
        <p className="text-primary">У вас пока нет друзей или заявок.</p>
      ) : (
        <>
          <FriendsSection
            title="Входящие заявки"
            friends={incomingRequests}
            isIncomingRequest
          />
          <FriendsSection title="Исходящие заявки" friends={outgoingRequests} />
          <FriendsSection friends={friends} />
        </>
      )}
    </RouteWrapper>
  );
};

export default Friends;
