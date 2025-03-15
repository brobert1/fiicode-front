import { useState, useEffect } from "react";

/**
 * Custom hook to manage drawing endpoints for custom routes
 *
 * @param {Object} options - Configuration options
 * @param {Object} options.directions - Current directions result
 * @param {Object} options.routeInfo - Current route information
 * @returns {Object} Drawing endpoints state and handlers
 */
const useDrawingEndpoints = ({ directions, routeInfo }) => {
  // Add state to store origin and destination points for drawing mode
  const [drawingEndpoints, setDrawingEndpoints] = useState(null);

  /**
   * Safely extract lat/lng values from a location object
   *
   * @param {Object} location - Location object (Google LatLng or plain object)
   * @returns {Object|null} Object with lat/lng or null if invalid
   */
  const safeGetLatLng = (location) => {
    if (!location) return null;

    // If it's a Google Maps LatLng object with lat() and lng() methods
    if (typeof location.lat === 'function' && typeof location.lng === 'function') {
      return { lat: location.lat(), lng: location.lng() };
    }

    // If it's a plain object with lat and lng properties
    if (typeof location.lat === 'number' && typeof location.lng === 'number') {
      return { lat: location.lat, lng: location.lng };
    }

    // If it has a toJSON method (some Google Maps objects have this)
    if (typeof location.toJSON === 'function') {
      const json = location.toJSON();
      return { lat: json.lat, lng: json.lng };
    }

    return null;
  };

  // Extract origin and destination coordinates from directions when they change
  useEffect(() => {
    if (directions && directions.routes && directions.routes.length > 0) {
      const route = directions.routes[0];
      if (route.legs && route.legs.length > 0) {
        const firstLeg = route.legs[0];

        // Safely get coordinates from start and end locations
        const startCoords = safeGetLatLng(firstLeg.start_location);
        const endCoords = safeGetLatLng(firstLeg.end_location);

        if (startCoords && endCoords) {
          setDrawingEndpoints({
            origin: {
              lat: startCoords.lat,
              lng: startCoords.lng,
              description: firstLeg.start_address,
            },
            destination: {
              lat: endCoords.lat,
              lng: endCoords.lng,
              description: firstLeg.end_address,
            },
            // Store the travel mode from routeInfo
            travelMode: routeInfo?.travelMode || "DRIVING",
          });
        }
      }
    }
    // We no longer clear drawingEndpoints when directions are cleared
    // This allows us to keep the endpoints for drawing mode
  }, [directions, routeInfo]);

  return {
    drawingEndpoints,
    setDrawingEndpoints
  };
};

export default useDrawingEndpoints;
