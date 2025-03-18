import { sendFriendRequest } from "@api/client";
import { Button } from "@components";
import { useMutation } from "@hooks";

const FriendRequestIcon = ({ status }) => {
  const icons = {
    pending: <i className="fas fa-clock"></i>,
    accepted: <i className="fas fa-check"></i>,
  };

  return icons[status] || <i className="fas fa-user-plus"></i>;
};

const IdentityCard = ({ identity, refetch }) => {
  const mutation = useMutation(sendFriendRequest, {
    successCallback: () => {
      refetch();
    },
  });

  const handleSendFriendRequest = () => {
    mutation.mutate({ to: identity._id });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        {identity?.image?.path ? (
          <img src={identity.image.path} alt={identity.name} className="w-12 h-12 rounded-full" />
        ) : (
          <img
            src={`https://ui-avatars.com/api/?name=${identity.name}&background=random`}
            alt={identity.name}
            className="w-12 h-12 rounded-full"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{identity.name}</h3>
          <p className="text-sm text-gray-500 truncate">{identity.email}</p>
        </div>
        <Button
          onClick={handleSendFriendRequest}
          disabled={mutation.isLoading || identity.friendRequestStatus !== null}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            identity.friendRequestStatus === null
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : identity.friendRequestStatus === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          <FriendRequestIcon status={identity.friendRequestStatus} />
        </Button>
      </div>
    </div>
  );
};

export default IdentityCard;
