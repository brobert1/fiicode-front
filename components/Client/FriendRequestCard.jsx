import { approveFriendRequest, rejectFriendRequest } from "@api/client";
import { ago } from "@functions";
import { useMutation } from "@hooks";
import { motion } from "framer-motion";

const FriendRequestCard = ({ id, from, onSwipe, isActive }) => {
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

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -40) {
      onSwipe(id, true);
    } else {
      onSwipe(id, false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg mb-3">
      <div className="absolute inset-y-0 right-0 flex items-center justify-center h-full">
        <div
          className="bg-green-500 text-white font-medium px-6 cursor-pointer h-full flex items-center w-20 justify-center"
          onClick={handleApprove}
        >
          Accept
        </div>
        <div
          className="bg-red-500 text-white font-medium px-6 cursor-pointer h-full flex items-center w-20 justify-center"
          onClick={handleReject}
        >
          Reject
        </div>
      </div>
      <motion.div
        className="bg-white rounded-lg p-4 relative z-10"
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: isActive ? -160 : 0 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 50,
          restDelta: 0.01,
        }}
      >
        <div className="flex items-start">
          <div className="bg-purple-500 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
            <i className="fas fa-user-friends text-white"></i>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{from.name}</h3>
            <p className="text-gray-600 text-sm mt-1">wants to be your friend</p>
            <span className="text-xs text-gray-500 mt-2 block">{ago(from.createdAt)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FriendRequestCard;
