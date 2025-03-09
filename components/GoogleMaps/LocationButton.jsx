import React, { useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { Button } from "@components";
import { classnames } from "@lib";

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
    <Button
      onClick={handleClick}
      disabled={isAnimating}
      className={classnames(
        "flex h-12 w-12 items-center justify-center rounded-lg bg-white text-primary shadow-md hover:bg-gray-50 transition-all duration-200 border border-gray-200",
        isAnimating && "location-pulse"
      )}
      aria-label="Get current location"
      title="Get current location"
    >
      <i
        className={classnames("fas fa-location-crosshairs text-lg", isAnimating && "zoom-in-out")}
      ></i>
    </Button>
  );
};

export default LocationButton;
