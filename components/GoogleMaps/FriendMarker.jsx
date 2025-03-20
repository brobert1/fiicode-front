import React, { useState, useMemo } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { Button } from "@components";
import { useRouter } from "next/router";
import { useMutation } from "@hooks";
import { createConversation } from "@api/client";
import { ago } from "@functions";
import { useWebSocket } from "../../contexts/WebSocketContext";

const FriendMarker = ({ friend, onGetDirections }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const router = useRouter();
  const { mutate: startConversation } = useMutation(createConversation);
  const { onlineUsers, friendLocations } = useWebSocket();

  // Check if friend is in the set of online users
  const isOnline = onlineUsers.has(friend._id);

  // Get real-time location from WebSocket context if available
  const position = useMemo(() => {
    // If we have a real-time location update, use it
    if (isOnline && friendLocations && friendLocations[friend._id]) {
      return {
        lat: friendLocations[friend._id].lat,
        lng: friendLocations[friend._id].lng,
      };
    }
    // Otherwise fallback to the last known location from the database
    else if (friend.lastLocation && friend.lastLocation.lat && friend.lastLocation.lng) {
      return { lat: friend.lastLocation.lat, lng: friend.lastLocation.lng };
    }
    // No valid location
    return null;
  }, [friend, isOnline, friendLocations]);

  // If we don't have a valid position, don't render the marker
  if (!position) {
    return null;
  }

  const handleGetDirections = (e) => {
    e.stopPropagation();
    if (onGetDirections) {
      onGetDirections({
        id: `friend-${friend._id}`,
        location: position,
        name: friend.name,
        address: `${friend.name}'s location`,
      });
      setIsInfoOpen(false);
    }
  };

  const handleStartConversation = (e) => {
    e.stopPropagation();
    startConversation(
      { participantId: friend._id },
      {
        onSuccess: (data) => {
          // Navigate to the chats page with this conversation active
          router.push({
            pathname: "/client/chats",
            query: { conversationId: data._id },
          });
          setIsInfoOpen(false);
        },
      }
    );
  };

  return (
    <AdvancedMarker position={position} onClick={() => setIsInfoOpen(true)}>
      <div className="relative flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full border-2 ${
            isOnline ? "border-green-500" : "border-blue-500"
          } shadow-lg overflow-hidden bg-white`}
        >
          {friend.image?.path ? (
            <img src={friend.image.path} alt={friend.name} className="w-full h-full object-cover" />
          ) : (
            <img
              src={`https://ui-avatars.com/api/?name=${friend.name}&background=random`}
              alt={friend.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4">
          <div
            className={`w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent ${
              isOnline ? "border-t-green-500" : "border-t-blue-500"
            }`}
          ></div>
        </div>
        {isOnline && friendLocations && friendLocations[friend._id] && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        )}
      </div>

      {isInfoOpen && (
        <InfoWindow position={position} onCloseClick={() => setIsInfoOpen(false)}>
          <div className="p-2 min-w-[180px]">
            <div className="flex flex-col items-center justify-center gap-2 mb-2">
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
              <p className="text-xs text-center text-gray-500 ">
                <i className={`fas ${isOnline ? "fa-circle text-green-500" : "fa-clock"} mr-1`}></i>
                {isOnline ? "Online now" : `Last seen ${ago(friend.lastActiveAt)}`}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="w-1/2">
                <Button
                  onClick={handleGetDirections}
                  className="w-full bg-secondary hover:bg-blue-600 text-white text-sm py-1.5 px-3 rounded flex items-center justify-center gap-1 transition-colors"
                >
                  <i className="fas fa-directions text-sm"></i>
                </Button>
              </div>
              <div className="w-1/2">
                <Button
                  onClick={handleStartConversation}
                  className="w-full bg-primary hover:bg-green-600 text-white text-sm py-1.5 px-3 rounded flex items-center justify-center gap-1 transition-colors"
                >
                  <i className="fas fa-message text-sm"></i>
                </Button>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default FriendMarker;
