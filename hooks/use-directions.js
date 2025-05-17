import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage directions state and operations
 *
 * @param {Object} options - Options for the hook
 * @param {Function} options.removeSearchedPlace - Function to remove a searched place
 * @returns {Object} Directions state and handler functions
 */
const useDirections = ({ removeSearchedPlace }) => {
  const [directionsVisible, setDirectionsVisible] = useState(false);
  const [directions, setDirections] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [destinationPlace, setDestinationPlace] = useState(null);
  const [directionDestinationId, setDirectionDestinationId] = useState(null);
  const [waypoints, setWaypoints] = useState([]);

  const handleDirectionsFound = useCallback((directionsResult, info) => {
    setDirections(directionsResult);
    setRouteInfo(info);

    // Store waypoints if provided
    if (info.waypoints && info.waypoints.length > 0) {
      setWaypoints(info.waypoints);
    } else {
      setWaypoints([]);
    }

    // Store the destination ID if it's from a searched place
    if (info.destination && info.destination.id) {
      setDirectionDestinationId(info.destination.id);
    }
  }, []);

  const handleClearDirections = useCallback(() => {
    // If we have a destination ID from directions, remove it from searched places
    if (directionDestinationId) {
      removeSearchedPlace(directionDestinationId);
      setDirectionDestinationId(null);
    }

    setDirections(null);
    setRouteInfo(null);
    setDestinationPlace(null);
    setWaypoints([]);
  }, [directionDestinationId, removeSearchedPlace]);

  const handleRouteChange = useCallback((newDirections) => {
    setDirections(newDirections);
  }, []);

  const handleDirectionsUpdate = useCallback((newDirections, newRouteInfo) => {
    setDirections(newDirections);
    setRouteInfo(newRouteInfo);

    // Update waypoints if available in the new route info
    if (newRouteInfo && newRouteInfo.waypoints) {
      setWaypoints(newRouteInfo.waypoints);
    }
  }, []);

  const handleGetDirections = useCallback((place) => {
    // Set the destination place and open the directions modal
    setDestinationPlace(place);
    setDirectionsVisible(true);

    // Immediately set the direction destination ID to hide the marker
    if (place && place.id) {
      setDirectionDestinationId(place.id);
    }
  }, []);

  // Clear destination place when directions modal is closed without getting directions
  useEffect(() => {
    if (!directionsVisible && !directions) {
      setDestinationPlace(null);
      setWaypoints([]);
    }
  }, [directionsVisible, directions]);

  return {
    directionsVisible,
    setDirectionsVisible,
    directions,
    routeInfo,
    destinationPlace,
    waypoints,
    handleDirectionsFound,
    handleClearDirections,
    handleRouteChange,
    handleDirectionsUpdate,
    handleGetDirections,
    directionDestinationId
  };
};

export default useDirections;
