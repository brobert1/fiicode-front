import { useState, useEffect } from "react";
import useQuery from "./use-query";
import { formatDistance, formatDuration } from "@functions";

/**
 * Custom hook to manage custom routes for maps
 *
 * @param {Object} options - Configuration options
 * @param {Object} options.directions - Current directions result
 * @param {Object} options.routeInfo - Current route information
 * @param {Function} options.onDirectionsUpdate - Function to update directions
 * @returns {Object} Custom routes state and handlers
 */
const useCustomRoutes = ({ directions, routeInfo, onDirectionsUpdate }) => {
  // State to track custom routes being displayed
  const [displayedCustomRoutes, setDisplayedCustomRoutes] = useState([]);
  const [selectedCustomRouteIndex, setSelectedCustomRouteIndex] = useState(-1);

  // Fetch custom routes from the public API endpoint
  const { data: customRoutes } = useQuery("/custom-routes");

  /**
   * Calculate distance between two points using Haversine formula
   *
   * @param {number} lat1 - Latitude of first point
   * @param {number} lon1 - Longitude of first point
   * @param {number} lat2 - Latitude of second point
   * @param {number} lon2 - Longitude of second point
   * @returns {number} Distance in kilometers
   */
  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  /**
   * Check if two points are close to each other (within 1km)
   *
   * @param {Object} point1 - First point with lat/lng
   * @param {Object} point2 - Second point with lat/lng
   * @returns {boolean} True if points are within 1km of each other
   */
  const isPointClose = (point1, point2) => {
    return getDistanceInKm(point1.lat, point1.lng, point2.lat, point2.lng) <= 1;
  };

  /**
   * Safely extract lat/lng values from a location object
   *
   * @param {Object} location - Location object (Google LatLng or plain object)
   * @returns {Object|null} Object with lat/lng or null if invalid
   */
  const safeGetLatLng = (location) => {
    if (!location) return null;

    // If it's a Google Maps LatLng object with lat() and lng() methods
    if (typeof location.lat === "function" && typeof location.lng === "function") {
      return { lat: location.lat(), lng: location.lng() };
    }

    // If it's a plain object with lat and lng properties
    if (typeof location.lat === "number" && typeof location.lng === "number") {
      return { lat: location.lat, lng: location.lng };
    }

    // If it has a toJSON method (some Google Maps objects have this)
    if (typeof location.toJSON === "function") {
      const json = location.toJSON();
      return { lat: json.lat, lng: json.lng };
    }

    return null;
  };

  /**
   * Check if a custom route is relevant to the searched route
   *
   * @param {Object} customRoute - Custom route object
   * @param {Object} searchedOrigin - Origin location from search
   * @param {Object} searchedDestination - Destination location from search
   * @returns {boolean} True if custom route is relevant
   */
  const isCustomRouteRelevant = (customRoute, searchedOrigin, searchedDestination) => {
    if (!customRoute || !searchedOrigin || !searchedDestination) return false;

    // Get coordinates from the search origin and destination
    const originCoords = safeGetLatLng(searchedOrigin);
    const destCoords = safeGetLatLng(searchedDestination);

    if (!originCoords || !destCoords) return false;

    // Check if custom route origin is close to searched origin
    const isOriginClose = isPointClose(customRoute.origin, originCoords);

    // Check if custom route destination is close to searched destination
    const isDestinationClose = isPointClose(customRoute.destination, destCoords);

    // For a custom route to be relevant, both the origin and destination must match
    // This ensures that a custom route from A to B is only shown when searching from A to B
    return isOriginClose && isDestinationClose;
  };

  /**
   * Add custom routes to directions result
   *
   * @param {Object} directionsResult - Google Maps directions result
   * @param {Array} customRoutes - Array of custom routes
   * @param {Object} info - Additional route information
   */
  const addCustomRoutesToDirections = (directionsResult, customRoutes, info) => {
    if (customRoutes.length === 0) return;

    // Create a copy of the directions result
    const newDirectionsResult = JSON.parse(JSON.stringify(directionsResult));

    // Get the first route as a template
    const firstRoute = newDirectionsResult.routes[0];

    // Get the current travel mode from info
    const currentTravelMode = info?.travelMode || "DRIVING";

    // Filter custom routes by travel mode - only WALKING and DRIVING are supported
    const filteredCustomRoutes = customRoutes
      .filter((route) => route.travelMode === "WALKING" || route.travelMode === "DRIVING")
      .filter((route) => route.travelMode === currentTravelMode);

    // Keep only the original Google routes (remove any previously added custom routes)
    // This prevents duplicate custom routes when travel mode changes
    newDirectionsResult.routes = newDirectionsResult.routes.filter((route) => !route.isCustomRoute);

    // For each relevant custom route, create a new route and add it to the directions
    filteredCustomRoutes.forEach((customRoute) => {
      // Convert the custom route path to Google Maps LatLng objects
      const routePath = customRoute.routePath.map(
        (point) => new window.google.maps.LatLng(point.lat, point.lng)
      );

      // Calculate the total distance in meters
      let totalDistanceMeters = 0;
      for (let i = 0; i < routePath.length - 1; i++) {
        totalDistanceMeters += window.google.maps.geometry.spherical.computeDistanceBetween(
          routePath[i],
          routePath[i + 1]
        );
      }

      // Calculate estimated duration based on travel mode and distance
      // Only WALKING and DRIVING are supported for custom routes
      let speedMetersPerSecond;
      switch (customRoute.travelMode) {
        case "WALKING":
          // Average walking speed: ~5 km/h = ~1.4 m/s
          speedMetersPerSecond = 1.4;
          break;
        case "DRIVING":
        default:
          // Average driving speed: ~50 km/h = ~13.9 m/s
          speedMetersPerSecond = 13.9;
          break;
      }

      // Calculate duration in seconds
      const durationSeconds = Math.round(totalDistanceMeters / speedMetersPerSecond);

      // Create a new route object
      const newRoute = {
        ...firstRoute,
        legs: [
          {
            ...firstRoute.legs[0],
            steps: [
              {
                // Add a single step with the entire path
                distance: { text: formatDistance(totalDistanceMeters), value: totalDistanceMeters },
                duration: { text: formatDuration(durationSeconds), value: durationSeconds },
                start_location: new window.google.maps.LatLng(
                  customRoute.origin.lat,
                  customRoute.origin.lng
                ),
                end_location: new window.google.maps.LatLng(
                  customRoute.destination.lat,
                  customRoute.destination.lng
                ),
                instructions: "Follow custom route",
                travel_mode: customRoute.travelMode,
                path: routePath, // This is important for the UnclickableDirectionsHandler
              },
            ],
            distance: { text: formatDistance(totalDistanceMeters), value: totalDistanceMeters },
            duration: { text: formatDuration(durationSeconds), value: durationSeconds },
            start_location: new window.google.maps.LatLng(
              customRoute.origin.lat,
              customRoute.origin.lng
            ),
            end_location: new window.google.maps.LatLng(
              customRoute.destination.lat,
              customRoute.destination.lng
            ),
            start_address: customRoute.origin.description || "Custom Origin",
            end_address: customRoute.destination.description || "Custom Destination",
          },
        ],
        overview_path: routePath,
        overview_polyline: {
          points: "", // Google Maps will handle this
        },
        warnings: ["This is a custom route created by an administrator"],
        waypoint_order: [],
        summary: `Custom Route (${customRoute.travelMode})`,
        isCustomRoute: true, // Mark as custom route
        customRouteData: customRoute,
        // Store the travel mode directly on the route
        travelMode: customRoute.travelMode,
      };

      // Add the new route to the directions result
      newDirectionsResult.routes.push(newRoute);
    });

    // Update the directions with the new result
    onDirectionsUpdate(newDirectionsResult, info);
  };

  /**
   * Handle directions found event with custom routes
   *
   * @param {Object} directionsResult - Google Maps directions result
   * @param {Object} info - Additional route information
   * @param {Function} handleDirectionsFound - Original handler function
   */
  const handleDirectionsWithCustomRoutes = (directionsResult, info, handleDirectionsFound) => {
    // First, call the original handler
    handleDirectionsFound(directionsResult, info);

    // Reset displayed custom routes
    setDisplayedCustomRoutes([]);
    setSelectedCustomRouteIndex(-1);

    // Only proceed if the travel mode is WALKING or DRIVING
    if (info?.travelMode !== "WALKING" && info?.travelMode !== "DRIVING") {
      return;
    }

    // If we have custom routes, check if any are relevant
    if (customRoutes && customRoutes.length > 0 && directionsResult && directionsResult.routes) {
      // Get the origin and destination from the first route's first leg
      const firstRoute = directionsResult.routes[0];
      if (firstRoute.legs && firstRoute.legs.length > 0) {
        const firstLeg = firstRoute.legs[0];
        const searchedOrigin = firstLeg.start_location;
        const searchedDestination = firstLeg.end_location;

        // Find relevant custom routes based on exact matching of origin and destination
        // Only include WALKING and DRIVING routes
        const relevantCustomRoutes = customRoutes.filter((route) => {
          // Filter by travel mode first
          if (route.travelMode !== "WALKING" && route.travelMode !== "DRIVING") {
            return false;
          }

          // Get coordinates from the search origin and destination
          const originCoords = safeGetLatLng(searchedOrigin);
          const destCoords = safeGetLatLng(searchedDestination);

          if (!originCoords || !destCoords) return false;

          // Check if custom route origin is close to searched origin
          const isOriginClose = isPointClose(route.origin, originCoords);

          // Check if custom route destination is close to searched destination
          const isDestinationClose = isPointClose(route.destination, destCoords);

          // Only return true if both origin and destination match
          return isOriginClose && isDestinationClose;
        });

        // Store all relevant custom routes
        if (relevantCustomRoutes.length > 0) {
          setDisplayedCustomRoutes(relevantCustomRoutes);

          // Add relevant custom routes to the directions result
          // The addCustomRoutesToDirections function will filter by travel mode
          addCustomRoutesToDirections(directionsResult, relevantCustomRoutes, info);
        }
      }
    }
  };

  // Effect to update displayed custom routes when travel mode changes
  useEffect(() => {
    // Only proceed if the travel mode is WALKING or DRIVING
    if (routeInfo?.travelMode !== "WALKING" && routeInfo?.travelMode !== "DRIVING") {
      return;
    }

    if (displayedCustomRoutes.length > 0 && directions && routeInfo) {
      // When travel mode changes, we need to re-filter the custom routes
      // and update the directions result

      // Reset the selected index first
      setSelectedCustomRouteIndex(-1);

      // Re-add custom routes filtered by the new travel mode
      addCustomRoutesToDirections(directions, displayedCustomRoutes, routeInfo);
    }
  }, [routeInfo?.travelMode]);

  return {
    displayedCustomRoutes,
    selectedCustomRouteIndex,
    setDisplayedCustomRoutes,
    setSelectedCustomRouteIndex,
    handleDirectionsWithCustomRoutes,
    addCustomRoutesToDirections,
    isCustomRouteRelevant,
    safeGetLatLng,
  };
};

export default useCustomRoutes;
