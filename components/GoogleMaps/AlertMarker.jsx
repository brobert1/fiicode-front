import React, { useState, useEffect } from "react";
import { AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { useMutation, useProfile } from "@hooks";
import { deleteAlert } from "@api/admin";
import { Button } from "@components";
import { ago } from "@functions";

const getAlertIconByType = (type) => {
  switch (type) {
    case "accident":
      return "fa-car-crash";
    case "construction":
      return "fa-hard-hat";
    case "congestion":
      return "fa-traffic-light";
    case "noise":
      return "fa-volume-high";
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
    case "noise":
      return "bg-purple-500";
    case "other":
    default:
      return "bg-blue-500";
  }
};

// Minimum zoom level at which markers should be visible
const MIN_ZOOM_LEVEL = 12;

const AlertMarker = ({ alert, airQualityLayerVisible }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const position = { lat: alert.location.latitude, lng: alert.location.longitude };
  const iconClass = getAlertIconByType(alert.type);
  const colorClass = getAlertColorByType(alert.type);
  const map = useMap();

  const mutation = useMutation(deleteAlert, {
    invalidateQueries: ["/alerts", "/admin/alerts", "/admin/stats"],
  });

  const { me } = useProfile();
  const isAdmin = me?.role === "admin";

  // Update marker visibility based on zoom level and, for noise type, air quality layer visibility
  useEffect(() => {
    if (!map) return;

    const handleZoomChanged = () => {
      const currentZoom = map.getZoom();
      const isZoomSufficient = currentZoom >= MIN_ZOOM_LEVEL;

      // For noise alerts, check if air quality layer is visible
      if (alert.type === "noise") {
        setIsVisible(isZoomSufficient && airQualityLayerVisible);
      } else {
        setIsVisible(isZoomSufficient);
      }
    };

    // Check initial visibility
    handleZoomChanged();

    // Add listener for zoom changes
    const listener = map.addListener("zoom_changed", handleZoomChanged);

    // Clean up listener on unmount
    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [map, alert.type, airQualityLayerVisible]);

  const handleMarkerClick = () => {
    if (isAdmin) {
      setIsInfoOpen(true);
    }
  };

  const handleCloseInfo = () => {
    setIsInfoOpen(false);
  };

  const handleDeleteAlert = async () => {
    if (!isAdmin) return;

    await mutation.mutate(alert._id);
  };

  // Don't render anything if not visible
  if (!isVisible) return null;

  return (
    <AdvancedMarker position={position} zIndex={1000} anchor="bottom" onClick={handleMarkerClick}>
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

      {isInfoOpen && isAdmin && (
        <InfoWindow position={position} onCloseClick={handleCloseInfo}>
          <div className="p-3 max-w-xs">
            <p className="text-sm capitalize text-gray-600">
              <span className="font-medium">Type: </span>
              {alert.type}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">Address: </span>
              {alert.location.address}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">Reported: </span>
              {ago(alert.createdAt)}
            </p>
            <Button
              onClick={handleDeleteAlert}
              disabled={mutation.isLoading}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Alert
            </Button>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default AlertMarker;
