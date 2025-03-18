import { Link } from "@components";
import { useQuery } from "@hooks";
import FriendBadge from "./FriendBadge";

const Friends = () => {
  const { data: friends, status } = useQuery("/client/friends");

  return (
    <div className="p-4 pt-0">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Friends</h3>
        <Link
          href="/client/add-friends"
          className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-full w-6 h-6 transition-colors"
        >
          <i className="fas fa-plus text-sm"></i>
        </Link>
      </div>
      <p className="text-gray-600 mt-2 mb-4">Find and connect with your friends on the map.</p>
      {status === "loading" && (
        <div className="text-center py-8 text-gray-500">
          <p>Loading friends...</p>
        </div>
      )}
      {status === "success" && friends.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No friends yet. Add some friends to get started!</p>
        </div>
      )}
      {status === "success" && friends.length > 0 && (
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-4 min-w-min">
            {friends.map((friend) => (
              <FriendBadge key={friend._id} friend={friend} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
