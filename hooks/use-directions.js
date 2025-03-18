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

  const handleDirectionsFound = useCallback((directionsResult, info) => {
    setDirections(directionsResult);
    setRouteInfo(info);

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
  }, [directionDestinationId, removeSearchedPlace]);

  const handleRouteChange = useCallback((newDirections) => {
    setDirections(newDirections);
  }, []);

  const handleDirectionsUpdate = useCallback((newDirections, newRouteInfo) => {
    setDirections(newDirections);
    setRouteInfo(newRouteInfo);
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
    }
  }, [directionsVisible, directions]);

  return {
    directionsVisible,
    setDirectionsVisible,
    directions,
    routeInfo,
    destinationPlace,
    handleDirectionsFound,
    handleClearDirections,
    handleRouteChange,
    handleDirectionsUpdate,
    handleGetDirections,
    directionDestinationId
  };
};

export default useDirections;
