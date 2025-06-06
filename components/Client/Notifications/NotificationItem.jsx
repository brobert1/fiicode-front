import { Link } from "@components";
import { ago } from "@functions";
import { motion } from "framer-motion";

const getAlertIconByType = (type, notificationType) => {
  if (notificationType === 'friendRequestNotification') {
    return 'fa-user-friends';
  }

  switch (type) {
    case "accident":
      return "fa-car-crash";
    case "construction":
      return "fa-hard-hat";
    case "congestion":
      return "fa-traffic-light";
    case "other":
    default:
      return "fa-exclamation-triangle";
  }
};

const getAlertColorByType = (type, notificationType) => {
  if (notificationType === 'friendRequestNotification') {
    return 'bg-purple-500';
  }

  switch (type) {
    case "accident":
      return "bg-red-500";
    case "construction":
      return "bg-yellow-500";
    case "congestion":
      return "bg-orange-500";
    case "other":
    default:
      return "bg-blue-500";
  }
};

const NotificationItem = ({ notification, onDelete, onSwipe, isActive }) => {
  const iconClass = getAlertIconByType(notification.type, notification.__t);
  const colorClass = getAlertColorByType(notification.type, notification.__t);
  const isFriendRequest = notification.__t === 'friendRequestNotification';

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -40) {
      onSwipe(notification._id, true);
    } else {
      onSwipe(notification._id, false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg mb-3">
      <div className="absolute inset-y-0 right-0 flex items-center justify-center h-full">
        {isFriendRequest && (
          <Link
            href="/client/friend-requests"
            className="bg-purple-500 text-white font-medium px-6 cursor-pointer h-full flex items-center w-20 justify-center"
          >
            See
          </Link>
        )}
        <div
          className="bg-red-500 text-white font-medium px-6 cursor-pointer h-full flex items-center w-20 justify-center"
          onClick={() => onDelete(notification._id)}
        >
          Delete
        </div>
      </div>
      <motion.div
        className="bg-white shadow-md rounded-lg p-4 relative z-10"
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: isActive ? (isFriendRequest ? -160 : -80) : 0 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 50,
          restDelta: 0.01,
        }}
      >
        <div className="flex items-start">
          <div
            className={`${colorClass} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-3`}
          >
            <i className={`fas ${iconClass} text-white`}></i>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{notification.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{notification.body}</p>
            <span className="text-xs text-gray-500 mt-2 block">{ago(notification.createdAt)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationItem;
