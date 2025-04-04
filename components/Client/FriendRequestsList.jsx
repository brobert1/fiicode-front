import { Error, Loading } from "@components";
import { useQuery } from "@hooks";
import FriendRequestCard from "./FriendRequestCard";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { isEmpty } from "lodash";
import { SentFriendRequestCard } from ".";

const FriendRequestsList = () => {
  const { data: friendRequests, status } = useQuery("/client/friend-requests");
  const [activeRequestId, setActiveRequestId] = useState(null);

  const handleSwipe = (id, isOpen) => {
    if (isOpen) {
      setActiveRequestId(id);
    } else if (activeRequestId === id) {
      setActiveRequestId(null);
    }
  };

  return (
    <div className="max-w-md p-4 pb-20">
      {status === "loading" && <Loading />}
      {status === "error" && <Error message="Error loading identities" />}
      {status === "success" && (
        <>
          {isEmpty(friendRequests?.received) && isEmpty(friendRequests?.sent) ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-user-friends text-4xl mb-3 block"></i>
              <p>No friend requests to display</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Received Friend Requests Section */}
              {!isEmpty(friendRequests?.received) && (
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Received Requests</h2>
                  <AnimatePresence>
                    {friendRequests.received.map((request) => (
                      <FriendRequestCard
                        createdAt={request.createdAt}
                        key={request._id}
                        from={request.from}
                        id={request._id}
                        onSwipe={handleSwipe}
                        isActive={activeRequestId === request._id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Sent Friend Requests Section */}
              {!isEmpty(friendRequests?.sent) && (
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Sent Requests</h2>
                  <AnimatePresence>
                    {friendRequests.sent.map((request) => (
                      <SentFriendRequestCard
                        createdAt={request.createdAt}
                        key={request._id}
                        to={request.to}
                        id={request._id}
                        onSwipe={handleSwipe}
                        isActive={activeRequestId === request._id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FriendRequestsList;
