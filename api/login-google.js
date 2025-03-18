import { store } from "@auth";
import { axios, router, toaster } from "@lib";
import { decode } from "jsonwebtoken";
import { updateLocation } from "./client";

const loginGoogle = async (data) => {
  const { token } = await axios.post("/login-google", data);
  const decoded = decode(token);
  if (!decoded) {
    throw new Error("Eroare! Nu te putem autentifica în acest moment");
  }
  store.dispatch({ type: "SET", jwt: token });
  const { role, hasPreferences } = decoded;
  if (!role) {
    throw new Error("Error! We cannot log you in at the moment");
  }

  // Update user location if client role and browser supports geolocation
  if (role === "client" && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const locationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          await updateLocation(locationData);
        } catch (locationErr) {
          console.error("Failed to update location:", locationErr);
          // Don't show error to user, non-critical operation
        }
      },
      (geoError) => console.error("Geolocation error:", geoError),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  // Notify user and other actions
  toaster.success("Autentificare reușită");

  if (role == "client" && !hasPreferences) {
    router.push("/client/preferences");
    return;
  }
  router.push(`/${role}`);
};

export default loginGoogle;
