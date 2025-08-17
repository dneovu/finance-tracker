import AddFriendForm from '@/components/forms/AddFriendForm';
import useFriends from '@/hooks/useFriends';
import FriendsSection from '@/components/FriendsSection';
import RouteWrapper from '@/components/wrappers/RouteWrapper';
import RouteTitle from '@/components/common/RouteTitle';
import BackButton from '@/components/common/BackButton';
import RouteGrowContent from '@/components/wrappers/RouteGrowContent';

const Friends = () => {
  const { friendsData, isLoading } = useFriends();
  const { friends, outgoingRequests, incomingRequests } = friendsData;

  return (
    <RouteWrapper>
      <RouteGrowContent>
        <RouteTitle text="Друзья" />
        <AddFriendForm />
        {isLoading ? (
          <p className="text-primary">Загрузка...</p>
        ) : friends.length === 0 &&
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
            <FriendsSection
              title="Исходящие заявки"
              friends={outgoingRequests}
            />
            <FriendsSection friends={friends} title="Ваши друзья" />
          </>
        )}
      </RouteGrowContent>
      <BackButton />
    </RouteWrapper>
  );
};

export default Friends;
