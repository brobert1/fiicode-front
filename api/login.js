import { store } from "@auth";
import { axios, router, toaster } from "@lib";
import { decode } from "jsonwebtoken";
import { updateLocation } from "./client";

const login = async (ref, data) => {
  try {
    // Execute google recaptcha
    data["g-recaptcha-response"] = await ref.current.executeAsync();

    const { token } = await axios.post("login", data);
    if (!decode(token)) {
      throw new Error("Error! We cannot log you in at the moment");
    }
    store.dispatch({ type: "SET", jwt: token });

    // Decode token to get user role
    const { role, hasPreferences } = decode(token) || {};
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
    toaster.success("Login successful");

    if (role == "client" && !hasPreferences) {
      router.push("/client/preferences");
      return;
    }

    router.push(`/${role}`);
  } catch (err) {
    // Handle error
    toaster.error(err.message);
  } finally {
    // Reset recaptcha
    ref.current.reset();
  }
};

export default login;
