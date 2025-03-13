/* eslint-disable no-undef */
/* eslint-disable no-console */
import { getDeviceType } from "@functions";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export let messaging = null;

// Only initialize messaging in browser environment
if (typeof window !== "undefined") {
  messaging = getMessaging(app);

  // Register service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
  }

  // Handle foreground messages
  onMessage(messaging, (payload) => {
    // Create notification manually for foreground messages
    if (Notification.permission === "granted" && payload.notification) {
      const { title, body } = payload.notification;
      new Notification(title, {
        body,
        icon: "/favicon.png",
      });
    }
  });
}

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.FIREBASE_FCM_VAPID_KEY,
    });

    if (!token) {
      console.error("Failed to generate FCM token.");
      return null;
    }

    const deviceType = getDeviceType();

    return { token, deviceType };
  } catch (error) {
    console.error("Error generating FCM token:", error);
    return null;
  }
};
