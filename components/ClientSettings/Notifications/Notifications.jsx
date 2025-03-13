import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import NotificationItem from "./NotificationItem";
import { useQuery } from "@hooks";
import { useProfile } from "@hooks";
import { isEmpty } from "lodash";
import { toaster } from "@lib";
import { Error, Loading } from "@components";

const Notifications = () => {
  const { data: rawData, status } = useQuery("/client/notifications");
  const { me } = useProfile();
  const [activeNotificationId, setActiveNotificationId] = useState(null);
  const [deletedIds, setDeletedIds] = useState([]);

  const userId = me?.me || "anonymous";
  const storageKey = `deletedNotifications_${userId}`;

  useEffect(() => {
    const storedDeletedIds = localStorage.getItem(storageKey);
    if (storedDeletedIds) {
      setDeletedIds(JSON.parse(storedDeletedIds));
    }
  }, [storageKey]);

  const data = rawData
    ? rawData.filter((notification) => !deletedIds.includes(notification._id))
    : [];

  const handleDelete = (id) => {
    const newDeletedIds = [...deletedIds, id];
    setDeletedIds(newDeletedIds);

    localStorage.setItem(storageKey, JSON.stringify(newDeletedIds));

    toaster.success("Notification deleted");

    if (activeNotificationId === id) {
      setActiveNotificationId(null);
    }
  };

  const handleSwipe = (id, isOpen) => {
    if (isOpen) {
      setActiveNotificationId(id);
    } else if (activeNotificationId === id) {
      setActiveNotificationId(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {status === "loading" && <Loading />}
      {status === "error" && <Error message="Failed to fetch notifications" />}
      {status === "success" && (
        <>
          {isEmpty(data) ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-bell-slash text-4xl mb-3 block"></i>
              <p>No notifications to display</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h2>
              <AnimatePresence>
                {data.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onSwipe={handleSwipe}
                    onDelete={handleDelete}
                    isActive={activeNotificationId === notification._id}
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

export default Notifications;
