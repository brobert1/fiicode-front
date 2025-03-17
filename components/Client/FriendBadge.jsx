import React from "react";

const formatLastSeen = (date) => {
  if (!date) return null;
  const minutes = Math.floor((new Date() - new Date(date)) / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
};

const FriendBadge = ({ friend }) => {
  return (
    <div key={friend._id} className="flex-shrink-0">
      <div className="flex flex-col items-center">
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
        {friend.lastLoginAt && (
          <div className="mt-1 min-w-[32px] h-5 rounded-[20px] bg-[#2c2c2c] text-white text-xs flex items-center justify-center px-2 whitespace-nowrap">
            {formatLastSeen(friend.lastLoginAt)}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendBadge;
