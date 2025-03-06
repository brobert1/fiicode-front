import React, { useState, useEffect } from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

const getAlertIconByType = (type) => {
  switch (type) {
    case "accident":
      return "fa-car-crash";
    case "construction":
      return "fa-hard-hat";
    case "congestion":
      return "fa-traffic-light";
    case "other":
    default:
      return "fa-exclamation-triangle";
  }
};

const getAlertColorByType = (type) => {
  switch (type) {
    case "accident":
      return "bg-red-500";
    case "construction":
      return "bg-yellow-500";
    case "congestion":
      return "bg-orange-500";
    case "other":
    default:
      return "bg-blue-500";
  }
};

// Minimum zoom level at which markers should be visible
const MIN_ZOOM_LEVEL = 12;

const AlertMarker = ({ alert }) => {
  const [isVisible, setIsVisible] = useState(false);
  const position = { lat: alert.location.latitude, lng: alert.location.longitude };
  const iconClass = getAlertIconByType(alert.type);
  const colorClass = getAlertColorByType(alert.type);
  const map = useMap();

  // Update marker visibility based on zoom level
  useEffect(() => {
    if (!map) return;

    const handleZoomChanged = () => {
      const currentZoom = map.getZoom();
      setIsVisible(currentZoom >= MIN_ZOOM_LEVEL);
    };

    // Check initial zoom level
    handleZoomChanged();

    // Add listener for zoom changes
    const listener = map.addListener("zoom_changed", handleZoomChanged);

    // Clean up listener on unmount
    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [map]);

  // Don't render anything if not visible
  if (!isVisible) return null;

  return (
    <AdvancedMarker position={position} zIndex={1000} anchor="bottom">
      <div className="relative">
        <div
          className={`w-8 h-8 ${colorClass} rounded-full border-2 border-white shadow-lg flex items-center justify-center`}
        >
          <i className={`fas ${iconClass} text-white text-sm`}></i>
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div
            className={`w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent ${colorClass.replace(
              "bg-",
              "border-t-"
            )}`}
          ></div>
        </div>
      </div>
    </AdvancedMarker>
  );
};

export default AlertMarker;
