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
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.png", // Add a default icon path
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
