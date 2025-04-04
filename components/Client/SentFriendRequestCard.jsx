import { cancelFriendRequest } from "@api/client";
import { ago } from "@functions";
import { useMutation } from "@hooks";
import { motion } from "framer-motion";

const SentFriendRequestCard = ({ id, to, onSwipe, createdAt, isActive }) => {
  const cancelMutation = useMutation(cancelFriendRequest, {
    invalidateQueries: ["/client/friend-requests"],
  });

  const handleCancel = () => {
    cancelMutation.mutate(id);
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
          className="bg-secondary text-white font-medium cursor-pointer h-full flex items-center w-24 justify-center group"
          onClick={handleCancel}
        >
          <span className="flex flex-col items-center transform transition-transform group-hover:scale-110">
            <i className="fas fa-undo-alt mb-1"></i>
            <span className="text-xs">Cancel</span>
          </span>
        </div>
      </div>
      <motion.div
        className="bg-white rounded-lg p-4 relative z-10 border-l-4 border-secondary"
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: isActive ? -96 : 0 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 50,
          restDelta: 0.01,
        }}
      >
        <div className="flex items-start">
          <div className="bg-secondary w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-3 shadow-sm">
            <i className="fas fa-paper-plane text-white"></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-semibold text-gray-800">{to.name}</h3>
              <div className="ml-2 px-2 py-0.5 bg-secondary bg-opacity-20 text-secondary rounded-full text-xs">
                Outgoing
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-1">Friend request sent</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <i className="fas fa-clock mr-1 text-secondary"></i>
              <span>{ago(createdAt)}</span>
              <span className="mx-2">•</span>
              <span className="text-secondary">Swipe to cancel</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SentFriendRequestCard;
