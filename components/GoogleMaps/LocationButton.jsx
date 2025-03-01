import React, { useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";

const LocationButton = ({ refreshLocation, userLocation }) => {
  const map = useMap();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);

    refreshLocation();

    if (map && userLocation) {
      map.setZoom(14);

      setTimeout(() => {
        map.panTo(userLocation);

        setTimeout(() => {
          map.setZoom(16);

          setTimeout(() => {
            setIsAnimating(false);
          }, 700);
        }, 300);
      }, 100);
    } else {
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAnimating}
      className={`flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-500 shadow-md hover:bg-gray-50 transition-all duration-200 border border-gray-200 ${
        isAnimating ? "location-pulse" : ""
      }`}
      aria-label="Get current location"
      title="Get current location"
    >
      <i className={`fas fa-location-crosshairs text-lg ${isAnimating ? "zoom-in-out" : ""}`}></i>
    </button>
  );
};

export default LocationButton;
