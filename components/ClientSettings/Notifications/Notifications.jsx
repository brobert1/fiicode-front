import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import NotificationItem from "./NotificationItem";

const sampleNotifications = [
  {
    id: 1,
    title: "Accident on Main Street",
    body: "A car accident has been reported on Main Street near downtown. Expect delays.",
    type: "accident",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: 2,
    title: "Construction on Highway 101",
    body: "Road construction on Highway 101 northbound. One lane closed for the next 2 weeks.",
    type: "construction",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 3,
    title: "Heavy Traffic on Bridge",
    body: "Heavy congestion reported on the bridge. Consider alternative routes.",
    type: "congestion",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: 4,
    title: "Road Closure",
    body: "Unexpected road closure due to fallen tree. Emergency services on site.",
    type: "other",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [activeNotificationId, setActiveNotificationId] = useState(null);

  const handleDelete = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
    setActiveNotificationId(null);
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h2>

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-bell-slash text-4xl mb-3 block"></i>
          <p>No notifications to display</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onDelete={handleDelete}
                onSwipe={handleSwipe}
                isActive={activeNotificationId === notification.id}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Notifications;
