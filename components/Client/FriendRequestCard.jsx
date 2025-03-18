import { approveFriendRequest, rejectFriendRequest } from "@api/client";
import { Button } from "@components";
import { useMutation } from "@hooks";

const FriendRequestCard = ({ id, from }) => {
  const approveMutation = useMutation(approveFriendRequest, {
    invalidateQueries: ["/client/friend-requests"],
  });
  const rejectMutation = useMutation(rejectFriendRequest, {
    invalidateQueries: ["/client/friend-requests"],
  });

  const handleApprove = () => {
    approveMutation.mutate(id);
  };

  const handleReject = () => {
    rejectMutation.mutate(id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        {from?.image?.path ? (
          <img src={from.image.path} alt={from.name} className="w-12 h-12 rounded-full" />
        ) : (
          <img
            src={`https://ui-avatars.com/api/?name=${from.name}&background=random`}
            alt={from.name}
            className="w-12 h-12 rounded-full"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{from.name}</h3>
          <p className="text-sm text-gray-500 truncate">{from.email}</p>
          <div className="mt-2 flex space-x-2">
            <Button
              onClick={handleApprove}
              className="bg-green-500 hover:bg-green-600 rounded-full text-white w-6 h-6 flex items-center justify-center"
            >
              <i className="fas fa-check"></i>
            </Button>
            <Button
              onClick={handleReject}
              className="bg-red-500 hover:bg-red-600 rounded-full text-white w-6 h-6 flex items-center justify-center"
            >
              <i className="fas fa-times"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendRequestCard;
