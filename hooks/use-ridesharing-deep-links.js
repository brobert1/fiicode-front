import { useState, useEffect } from "react";
import { getDeviceType } from "@functions";

/**
 * Custom hook for handling ridesharing deep links
 * @param {Object} origin - Origin location with lat, lng, and address properties
 * @param {Object} destination - Destination location with lat, lng, and address properties
 * @returns {Object} - Functions and state for handling ridesharing deep links
 */
const useRidesharingDeepLinks = (origin, destination) => {
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    // Detect device type on component mount
    setDeviceType(getDeviceType().toLowerCase());
  }, []);

  /**
   * Formats a deep link for a ridesharing partner
   * @param {Object} partner - The ridesharing partner object
   * @returns {boolean} - Whether the link was successfully opened
   */
  const openPartnerDeepLink = (partner) => {
    if (!partner?.deep_link) return false;

    // Check if origin and destination coordinates are available
    if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
      console.error("Missing coordinates for ridesharing deep link", { origin, destination });
      return false;
    }

    let formattedLink = "";
    const isMobile = deviceType.includes("android") || deviceType.includes("ios");

    // Create objects for Uber format
    const pickupObj = {
      addressLine1: origin.address || "Origin Location",
      addressLine2: origin.vicinity || "",
      latitude: origin.lat,
      longitude: origin.lng,
      id: origin.place_id || "",
      source: "SEARCH",
      provider: "google_places",
    };

    const dropoffObj = {
      addressLine1: destination.address || "Destination Location",
      addressLine2: destination.vicinity || "",
      latitude: destination.lat,
      longitude: destination.lng,
      id: destination.place_id || "",
      source: "SEARCH",
      provider: "google_places",
    };

    // Format the deep link based on the partner type
    switch (partner.name.toLowerCase()) {
      case "uber":
        if (isMobile) {
          // Use native URI scheme on mobile devices
          formattedLink = `uber://?action=setPickup&pickup[latitude]=${origin.lat.toFixed(
            6
          )}&pickup[longitude]=${origin.lng.toFixed(6)}&pickup[nickname]=${encodeURIComponent(
            origin.address || "Pickup"
          )}&dropoff[latitude]=${destination.lat.toFixed(
            6
          )}&dropoff[longitude]=${destination.lng.toFixed(
            6
          )}&dropoff[nickname]=${encodeURIComponent(destination.address || "Dropoff")}`;
        } else {
          // Use web URL on desktop
          formattedLink = `https://m.uber.com/go/drop?drop[0]=${encodeURIComponent(
            JSON.stringify(dropoffObj)
          )}&pickup=${encodeURIComponent(JSON.stringify(pickupObj))}`;
        }
        break;

      case "bolt":
        if (isMobile) {
          // Use native URI scheme on mobile devices
          formattedLink = `bolt://?pickup_lat=${origin.lat.toFixed(
            6
          )}&pickup_lng=${origin.lng.toFixed(6)}&destination_lat=${destination.lat.toFixed(
            6
          )}&destination_lng=${destination.lng.toFixed(6)}`;
        } else {
          // Use web URL on desktop - use the deep_link from the database
          formattedLink = partner.deep_link
            .replace("START_LAT", origin.lat.toFixed(6))
            .replace("START_LON", origin.lng.toFixed(6))
            .replace("END_LAT", destination.lat.toFixed(6))
            .replace("END_LON", destination.lng.toFixed(6));

          if (formattedLink.includes("START_ADDRESS") || formattedLink.includes("END_ADDRESS")) {
            formattedLink = formattedLink
              .replace("START_ADDRESS", encodeURIComponent(origin.address || ""))
              .replace("END_ADDRESS", encodeURIComponent(destination.address || ""));
          }
        }
        break;

      case "blackcab":
        // BlackCab format - always use the deep_link from the database
        formattedLink = partner.deep_link
          .replace("START_LAT", origin.lat.toFixed(6))
          .replace("START_LON", origin.lng.toFixed(6))
          .replace("END_LAT", destination.lat.toFixed(6))
          .replace("END_LON", destination.lng.toFixed(6));

        // If BlackCab supports address information, include it
        if (formattedLink.includes("START_ADDRESS") || formattedLink.includes("END_ADDRESS")) {
          formattedLink = formattedLink
            .replace("START_ADDRESS", encodeURIComponent(origin.address || ""))
            .replace("END_ADDRESS", encodeURIComponent(destination.address || ""));
        }
        break;

      default:
        // For other partners, use the standard placeholder format from the deep_link
        formattedLink = partner.deep_link
          .replace("START_LAT", origin.lat.toFixed(6))
          .replace("START_LON", origin.lng.toFixed(6))
          .replace("END_LAT", destination.lat.toFixed(6))
          .replace("END_LON", destination.lng.toFixed(6));

        // If the link still contains placeholders, try alternative formats
        if (formattedLink.includes("PICKUP_LAT") || formattedLink.includes("PICKUP_LNG")) {
          formattedLink = formattedLink
            .replace("PICKUP_LAT", origin.lat.toFixed(6))
            .replace("PICKUP_LNG", origin.lng.toFixed(6))
            .replace("PICKUP_LONGITUDE", origin.lng.toFixed(6))
            .replace("DROPOFF_LAT", destination.lat.toFixed(6))
            .replace("DROPOFF_LNG", destination.lng.toFixed(6))
            .replace("DROPOFF_LONGITUDE", destination.lng.toFixed(6));
        }

        // If the partner supports address information, try to include it
        if (formattedLink.includes("START_ADDRESS") || formattedLink.includes("END_ADDRESS")) {
          formattedLink = formattedLink
            .replace("START_ADDRESS", encodeURIComponent(origin.address || ""))
            .replace("END_ADDRESS", encodeURIComponent(destination.address || ""));
        }
    }

    // Open the link
    try {
      window.open(formattedLink, "_blank");
      return true;
    } catch (error) {
      console.error("Error opening ridesharing link:", error);
      return false;
    }
  };

  return {
    openPartnerDeepLink,
    isMobile: deviceType.includes("android") || deviceType.includes("ios"),
    deviceType,
  };
};

export default useRidesharingDeepLinks;
