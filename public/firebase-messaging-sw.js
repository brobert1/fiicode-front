/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */

// Import and initialize the Firebase SDK
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBkjDQsCAjs6o4wGHErlGJ_5ZcGQOvB3C4",
  authDomain: "pathly-918db.firebaseapp.com",
  projectId: "pathly-918db",
  storageBucket: "pathly-918db.firebasestorage.app",
  messagingSenderId: "795399502455",
  appId: "1:795399502455:web:14a39c552e4d04d8ac2472",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  // Always show notification if we have notification data
  if (payload.notification) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/favicon.png", // Add a default icon path
      // Pass through any custom data
      data: payload.data || {},
      // Add a tag to prevent duplicate notifications
      tag: payload.data?.alertId || 'notification-' + Date.now()
    };

    console.log("[firebase-messaging-sw.js] Showing notification:", notificationTitle, notificationOptions);
    return self.registration.showNotification(notificationTitle, notificationOptions);
  }

  return null;
});

// Add notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event);

  // Close the notification
  event.notification.close();

  // Handle the click - you can add custom logic here to open specific pages
  // based on the notification data
  const alertId = event.notification.data?.alertId;

  if (alertId) {
    // This could open a specific page related to the alert
    const urlToOpen = new URL(`/alerts/${alertId}`, self.location.origin).href;

    const promiseChain = clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, focus it
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    });

    event.waitUntil(promiseChain);
  }
});
