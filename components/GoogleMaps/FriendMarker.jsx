import React, { useState } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { Button } from "@components";

const FriendMarker = ({ friend, onGetDirections }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  if (!friend.lastLocation || !friend.lastLocation.lat || !friend.lastLocation.lng) {
    return null;
  }

  const position = { lat: friend.lastLocation.lat, lng: friend.lastLocation.lng };

  const handleGetDirections = (e) => {
    e.stopPropagation();
    if (onGetDirections) {
      onGetDirections({
        id: `friend-${friend._id}`,
        location: position,
        name: friend.name,
        address: `${friend.name}'s location`
      });
      setIsInfoOpen(false);
    }
  };

  return (
    <AdvancedMarker position={position} onClick={() => setIsInfoOpen(true)}>
      <div className="relative flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-lg overflow-hidden bg-white">
          {friend.image?.path ? (
            <img
              src={friend.image.path}
              alt={friend.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={`https://ui-avatars.com/api/?name=${friend.name}&background=random`}
              alt={friend.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-blue-500"></div>
        </div>

        {/* Name label under marker */}
        <div className="mt-1 bg-white px-2 py-1 rounded-md shadow-md text-xs font-medium text-center max-w-[80px] truncate">
          {friend.name}
        </div>
      </div>

      {isInfoOpen && (
        <InfoWindow position={position} onCloseClick={() => setIsInfoOpen(false)}>
          <div className="p-2 min-w-[180px]">
            <div className="flex items-center gap-2 mb-2">
              {friend.image?.path ? (
                <img
                  src={friend.image.path}
                  alt={friend.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${friend.name}&background=random`}
                  alt={friend.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <h3 className="font-medium">{friend.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Last seen at this location
            </p>
            <Button
              onClick={handleGetDirections}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-1.5 px-3 rounded flex items-center justify-center gap-1 transition-colors"
            >
              <i className="fas fa-directions text-sm"></i>
              <span>Get Directions</span>
            </Button>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default FriendMarker;
