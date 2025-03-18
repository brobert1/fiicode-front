import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { useMapNavigation } from "../../../contexts/MapNavigationContext";

/**
 * Component to handle automatic map navigation to target locations
 * Handles panning/zooming and automatically clicks markers at the target location
 */
const MapNavigationHandler = () => {
  const map = useMap();
  const { targetLocation, setTargetLocation } = useMapNavigation();
  const prevTargetRef = useRef(null);

  useEffect(() => {
    if (!map || !targetLocation) {
      return;
    }

    // Always navigate to the friend's location when requested
    map.panTo(targetLocation.position);
    if (targetLocation.zoom) {
      map.setZoom(targetLocation.zoom);
    }

    // Try to find and click the marker
    setTimeout(() => {
      const markers = document.querySelectorAll('[aria-label="Map marker"]');
      markers.forEach((marker) => {
        // Click marker if it's at the target location
        const markerRect = marker.getBoundingClientRect();
        const centerX = markerRect.left + markerRect.width / 2;
        const centerY = markerRect.top + markerRect.height / 2;

        // Get marker screen position to verify it's our target marker
        if (centerX > 0 && centerY > 0) {
          marker.click();
        }
      });
    }, 300);

    // Store the current target for reference
    prevTargetRef.current = targetLocation;

    // Reset the target after navigation is complete
    const timeoutId = setTimeout(() => {
      setTargetLocation(null);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [map, targetLocation, setTargetLocation]);

  return null;
};

export default MapNavigationHandler;
