import React, { useEffect, useState } from "react";
import { useQuery } from "@hooks";

const RidesharingPartners = ({ origin, destination }) => {
  const { data, status } = useQuery("/client/partners");
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    if (status === "success" && data) {
      // Format the data depending on the API response structure
      const formattedPartners = Array.isArray(data) ? data : data.data || [];
      setPartners(formattedPartners);
    }
  }, [data, status]);

  const handleOpenPartnerApp = (partner) => {
    if (!partner?.deep_link) return;

    // Check if origin and destination coordinates are available
    if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
      console.error("Missing coordinates for ridesharing deep link", { origin, destination });
      alert("Cannot open ridesharing app: Missing location coordinates");
      return;
    }

    let formattedLink = "";

    // Create objects for Uber format outside the switch to avoid linter errors
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
        // Try multiple Uber deep link formats to increase chances of app opening

        // Format 1: Native URI scheme (higher chance of opening the app)
        // uber://?action=setPickup&pickup[latitude]={lat}&pickup[longitude]={lng}&pickup[nickname]={name}&dropoff[latitude]={lat}&dropoff[longitude]={lng}&dropoff[nickname]={name}
        formattedLink = `uber://?action=setPickup&pickup[latitude]=${origin.lat.toFixed(6)}&pickup[longitude]=${origin.lng.toFixed(6)}&pickup[nickname]=${encodeURIComponent(origin.address || "Pickup")}&dropoff[latitude]=${destination.lat.toFixed(6)}&dropoff[longitude]=${destination.lng.toFixed(6)}&dropoff[nickname]=${encodeURIComponent(destination.address || "Dropoff")}`;

        try {
          // First try to open with the native URI scheme
          const opened = window.open(formattedLink, "_blank");

          // If it fails or is blocked, fall back to the web URL
          if (!opened || opened.closed || typeof opened.closed === 'undefined') {
            // Format 2: Web URL format (fallback)
            const webLink = `https://m.uber.com/go/drop?drop[0]=${encodeURIComponent(
              JSON.stringify(dropoffObj)
            )}&pickup=${encodeURIComponent(JSON.stringify(pickupObj))}`;

            setTimeout(() => {
              window.open(webLink, "_blank");
            }, 500);
          }
        } catch (error) {
          // If the URI scheme fails, use the web URL
          const webLink = `https://m.uber.com/go/drop?drop[0]=${encodeURIComponent(
            JSON.stringify(dropoffObj)
          )}&pickup=${encodeURIComponent(JSON.stringify(pickupObj))}`;

          window.open(webLink, "_blank");
        }
        return; // Return early since we've handled opening the link

      case "bolt":
        // Bolt typically uses a simpler format with coordinates
        // Try native URI scheme first for Bolt
        formattedLink = `bolt://?pickup_lat=${origin.lat.toFixed(6)}&pickup_lng=${origin.lng.toFixed(6)}&destination_lat=${destination.lat.toFixed(6)}&destination_lng=${destination.lng.toFixed(6)}`;

        try {
          const opened = window.open(formattedLink, "_blank");

          // If native URI fails, fall back to the web/deep link
          if (!opened || opened.closed || typeof opened.closed === 'undefined') {
            const webLink = partner.deep_link
              .replace("START_LAT", origin.lat.toFixed(6))
              .replace("START_LON", origin.lng.toFixed(6))
              .replace("END_LAT", destination.lat.toFixed(6))
              .replace("END_LON", destination.lng.toFixed(6));

            if (webLink.includes("START_ADDRESS") || webLink.includes("END_ADDRESS")) {
              formattedLink = webLink
                .replace("START_ADDRESS", encodeURIComponent(origin.address || ""))
                .replace("END_ADDRESS", encodeURIComponent(destination.address || ""));
            } else {
              formattedLink = webLink;
            }

            setTimeout(() => {
              window.open(formattedLink, "_blank");
            }, 500);
          }
        } catch (error) {
          // Fall back to the web link if URI scheme fails
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

          window.open(formattedLink, "_blank");
        }
        return; // Return early since we've handled opening the link

      case "blackcab":
        // BlackCab format - if they have a specific format, we can customize it here
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
        // For other partners, use the standard placeholder format
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

    // Open the deep link for partners not specifically handled above
    try {
      window.open(formattedLink, "_blank");
    } catch (error) {
      console.error("Error opening ridesharing deep link:", error);
      alert("Error opening ridesharing app. Please try again.");
    }
  };

  if (partners.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <i className="fas fa-info-circle text-blue-500 text-2xl"></i>
        </div>
        <p className="text-center mt-2 text-gray-600">No ridesharing partners available.</p>
      </div>
    );
  }

  return (
    <>
      {status === "error" && (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-center">
            <i className="fas fa-exclamation-circle text-red-500 text-2xl"></i>
          </div>
          <p className="text-center mt-2 text-gray-600">
            Could not load ridesharing options. Please try again.
          </p>
        </div>
      )}
      {status === "loading" && (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-center">
            <i className="fas fa-circle-notch fa-spin text-blue-500 text-2xl"></i>
          </div>
          <p className="text-center mt-2 text-gray-600">Loading ridesharing options...</p>
        </div>
      )}
      {status === "success" && (
        <div className="overflow-y-auto overscroll-contain max-h-[40vh] md:max-h-[40vh] p-4 pb-0 touch-pan-y">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Available Ridesharing Options
          </h3>
          <div className="overflow-y-auto flex-grow pr-1 -mr-1 pb-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {partners.map((partner) => (
                <div
                  key={partner._id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleOpenPartnerApp(partner)}
                >
                  <div className="w-12 h-12 flex-shrink-0 mr-3">
                    <img
                      src={partner.image}
                      alt={`${partner.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h4 className="font-medium text-gray-800 truncate">{partner.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 overflow-ellipsis">
                      {partner.description}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <i className="fas fa-external-link-alt text-blue-500"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer info */}
          <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
            <i className="fas fa-info-circle mr-1"></i>
            Click on a partner to open their app with your route
          </p>
        </div>
      )}
    </>
  );
};

export default RidesharingPartners;
