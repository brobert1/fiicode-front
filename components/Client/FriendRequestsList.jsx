import { Error, Loading } from "@components";
import { useQuery } from "@hooks";
import FriendRequestCard from "./FriendRequestCard";

const FriendRequestsList = () => {
  const { data: friendRequests, status } = useQuery("/client/friend-requests");

  return (
    <div className="space-y-3 mt-4 overflow-y-auto no-scrollbar max-w-md mx-auto p-4">
      {status === "loading" && <Loading />}
      {status === "error" && <Error message="Error loading identities" />}
      {status === "success" && friendRequests.length === 0 && (
        <div className="text-center py-4 text-gray-500">No friend requests yet</div>
      )}
      {status === "success" && friendRequests.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Friend Requests</h2>
          {friendRequests.map((request) => (
            <FriendRequestCard key={request.id} from={request.from} id={request._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequestsList;
