import { Error, Loading } from "@components";
import { useQuery } from "@hooks";
import FriendRequestCard from "./FriendRequestCard";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { isEmpty } from "lodash";

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
    <div className="max-w-md p-4">
      {status === "loading" && <Loading />}
      {status === "error" && <Error message="Error loading identities" />}
      {status === "success" && (
        <>
          {isEmpty(friendRequests) ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-user-friends text-4xl mb-3 block"></i>
              <p>No friend requests to display</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Friend Requests</h2>
              <AnimatePresence>
                {friendRequests.map((request) => (
                  <FriendRequestCard
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
        </>
      )}
    </div>
  );
};

export default FriendRequestsList;
