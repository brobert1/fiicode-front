import React from "react";
import { useMapNavigation } from "../../contexts/MapNavigationContext";
import { useSlideUpMenu } from "../../contexts/SlideUpMenuContext";
import { useWebSocket } from "../../contexts/WebSocketContext";

const formatLastSeen = (date) => {
  if (!date) return null;
  const minutes = Math.floor((new Date() - new Date(date)) / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
};

const FriendBadge = ({ friend }) => {
  const { navigateToLocation } = useMapNavigation();
  const { closeMenu } = useSlideUpMenu();
  const { onlineUsers } = useWebSocket();

  // Check if friend is in the set of online users
  const isOnline = onlineUsers.has(friend._id);

  const handleClick = () => {
    if (friend.lastLocation && friend.lastLocation.lat && friend.lastLocation.lng) {
      // Navigate to the friend's location
      navigateToLocation({
        position: friend.lastLocation,
        friendId: friend._id,
        zoom: 17, // Zoomed in enough to see the friend clearly
      });

      // Close the slide-up menu
      closeMenu();
    }
  };

  const hasLocation = friend.lastLocation && friend.lastLocation.lat && friend.lastLocation.lng;

  return (
    <div key={friend._id} className="flex-shrink-0">
      <div
        className={`flex flex-col items-center ${
          hasLocation ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
        }`}
        onClick={hasLocation ? handleClick : undefined}
        title={
          hasLocation
            ? `View ${friend.name}'s location`
            : `${friend.name} hasn't shared their location`
        }
      >
        <div className="relative">
          {friend.image?.path ? (
            <img
              src={friend.image.path}
              alt={friend.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <img
              src={`https://ui-avatars.com/api/?name=${friend.name}&background=random`}
              alt={friend.name}
              className="w-12 h-12 rounded-full"
            />
          )}
          {isOnline ? (
            <div className="absolute -right-1 -bottom-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"></div>
          ) : (
            friend.lastActiveAt && (
              <div className="absolute -right-1 -bottom-1 w-5 h-5 bg-gray-500 rounded-full border-2 border-white flex items-center justify-center text-[7px] text-white font-medium">
                {formatLastSeen(friend.lastActiveAt)}
              </div>
            )
          )}
        </div>
        <div className="text-sm mt-1 font-medium text-center">{friend.name}</div>
      </div>
    </div>
  );
};

export default FriendBadge;
