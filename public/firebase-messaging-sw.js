/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */

// Import and initialize the Firebase SDK
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

// Fetch Firebase config dynamically
fetch("/firebase-config.json")
  .then((response) => response.json())
  .then((firebaseConfig) => {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Get an instance of Firebase Messaging
    const messaging = firebase.messaging();

    // Handle background messages
    messaging.onBackgroundMessage((payload) => {
      console.log("[firebase-messaging-sw.js] Received background message ", payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: "/favicon.png", // Add a default icon path
      };

      return self.registration.showNotification(notificationTitle, notificationOptions);
    });
  })
  .catch((error) => {
    console.error("Error fetching Firebase config:", error);
  });
