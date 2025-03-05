import { useState, useEffect, useCallback } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { isSameRoute } from "@functions/route-utils";

/**
 * Custom hook to manage route state and operations
 *
 * @param {Object} options - Options for the hook
 * @param {Object} options.directions - The directions object
 * @param {Object} options.routeInfo - Information about the route
 * @param {Function} options.onDirectionsUpdate - Callback when directions are updated
 * @returns {Object} Route state and handler functions
 */
const useRouteManager = ({ directions, routeInfo, onDirectionsUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [originalRoutes, setOriginalRoutes] = useState([]);
  const [selectedTravelMode, setSelectedTravelMode] = useState(routeInfo?.travelMode || "DRIVING");
  const [isChangingMode, setIsChangingMode] = useState(false);
  const [directionsService, setDirectionsService] = useState(null);

  // Load the routes library
  const routesLibrary = useMapsLibrary("routes");

  // Initialize the DirectionsService when the routes library is loaded
  useEffect(() => {
    if (!routesLibrary) return;
    setDirectionsService(new routesLibrary.DirectionsService());
  }, [routesLibrary]);

  // Store the original routes when directions change
  useEffect(() => {
    if (directions && directions.routes) {
      setOriginalRoutes(
        directions.routes.map((route, index) => ({
          route,
          originalIndex: index,
        }))
      );
      setSelectedRouteIndex(0);
    }
  }, [directions]);

  // Update selected travel mode when routeInfo changes
  useEffect(() => {
    if (routeInfo?.travelMode) {
      setSelectedTravelMode(routeInfo.travelMode);
    }
  }, [routeInfo]);

  // Update selected route index when routes are reordered externally (by clicking on the map)
  useEffect(() => {
    if (directions && directions.routes && originalRoutes.length > 0) {
      // Try to find the current primary route in our original routes
      const primaryRoute = directions.routes[0];

      // Find the index of this route in our original routes array
      const newSelectedIndex = originalRoutes.findIndex((item) =>
        isSameRoute(item.route, primaryRoute)
      );

      if (newSelectedIndex !== -1 && newSelectedIndex !== selectedRouteIndex) {
        setSelectedRouteIndex(newSelectedIndex);
      }
    }
  }, [directions, originalRoutes, selectedRouteIndex]);

  // Handle travel mode change
  const handleTravelModeChange = useCallback(
    (newMode) => {
      if (newMode === selectedTravelMode) {
        return;
      }

      setSelectedTravelMode(newMode);

      // For RIDESHARING mode, we don't need to make a directions request
      if (newMode === "RIDESHARING") {
        if (onDirectionsUpdate && directions) {
          // Just update the travel mode without changing the directions
          onDirectionsUpdate(directions, {
            ...routeInfo,
            travelMode: newMode,
          });
        }
        return;
      }

      if (!directionsService || !routeInfo?.origin || !routeInfo?.destination) {
        console.error("Cannot change travel mode: missing directionsService or route info");
        return;
      }

      setIsChangingMode(true);

      const request = {
        origin: routeInfo.origin.location,
        destination: routeInfo.destination.location,
        travelMode: newMode,
        provideRouteAlternatives: true,
      };

      directionsService.route(request, (result, status) => {
        setIsChangingMode(false);

        if (status === routesLibrary.DirectionsStatus.OK) {
          // Update directions with the new travel mode
          if (onDirectionsUpdate) {
            onDirectionsUpdate(result, {
              ...routeInfo,
              travelMode: newMode,
            });
          }
        } else {
          console.error("Directions request failed:", status);
        }
      });
    },
    [directionsService, onDirectionsUpdate, routeInfo, routesLibrary, selectedTravelMode, directions]
  );

  // Toggle expanded state
  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return {
    isExpanded,
    toggleExpanded,
    selectedRouteIndex,
    originalRoutes,
    selectedTravelMode,
    isChangingMode,
    handleTravelModeChange,
  };
};

export default useRouteManager;
