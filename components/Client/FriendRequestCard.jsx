import { approveFriendRequest, rejectFriendRequest } from "@api/client";
import { ago } from "@functions";
import { useMutation } from "@hooks";
import { motion } from "framer-motion";

const FriendRequestCard = ({ id, from, onSwipe, isActive, createdAt }) => {
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
    <div className="relative overflow-hidden rounded-lg mb-3 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="absolute inset-y-0 right-0 flex items-center justify-center h-full">
        <div
          className="bg-green-500 text-white font-medium cursor-pointer h-full flex items-center w-20 justify-center group"
          onClick={handleApprove}
        >
          <span className="flex flex-col items-center transform transition-transform group-hover:scale-110">
            <i className="fas fa-check-circle mb-1"></i>
            <span className="text-xs">Accept</span>
          </span>
        </div>
        <div
          className="bg-accent text-white font-medium cursor-pointer h-full flex items-center w-20 justify-center group"
          onClick={handleReject}
        >
          <span className="flex flex-col items-center transform transition-transform group-hover:scale-110">
            <i className="fas fa-times-circle mb-1"></i>
            <span className="text-xs">Decline</span>
          </span>
        </div>
      </div>
      <motion.div
        className="bg-white rounded-lg p-4 relative z-10 border-l-4 border-primary"
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
          <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-3 shadow-sm">
            <i className="fas fa-user-plus text-white"></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-semibold text-gray-800">{from.name}</h3>
              <div className="ml-2 px-2 py-0.5 bg-primary bg-opacity-20 text-primary rounded-full text-xs">
                New
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-1">Would like to connect with you</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <i className="fas fa-clock mr-1 text-primary"></i>
              <span>{ago(createdAt)}</span>
              <span className="mx-2">•</span>
              <span className="text-primary">Swipe to respond</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FriendRequestCard;
