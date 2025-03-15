import { useState, useCallback } from 'react';

/**
 * Custom hook to handle map click tooltip state
 *
 * @param {Object} options - Options for the hook
 * @param {boolean} options.directionsActive - Whether directions are active
 * @param {boolean} options.searchVisible - Whether search is visible
 * @returns {Object} Tooltip state and handler functions
 */
const useMapClickTooltip = ({ directionsActive, searchVisible }) => {
  const [clickedLocation, setClickedLocation] = useState(null);

  const handleMapClick = useCallback((event) => {
    // Don't show tooltip if directions are active or search is visible
    if (directionsActive || searchVisible) return;

    // Close any existing tooltip
    setClickedLocation(null);

    // Extract and validate the location data
    let location = null;

    if (event && event.detail && event.detail.latLng) {
      // Handle Map onClick event from @vis.gl/react-google-maps
      location = {
        lat: event.detail.latLng.lat,
        lng: event.detail.latLng.lng
      };
    } else if (event && typeof event.lat === 'number' && typeof event.lng === 'number') {
      // Handle direct LatLng object
      location = {
        lat: event.lat,
        lng: event.lng
      };
    }

    // Only set location if it's valid
    if (location) {
      // Set a small timeout to ensure the previous tooltip is closed
      setTimeout(() => {
        setClickedLocation(location);
      }, 10);
    }
  }, [directionsActive, searchVisible]);

  const handleCloseTooltip = useCallback(() => {
    setClickedLocation(null);
  }, []);

  return {
    clickedLocation,
    handleMapClick,
    handleCloseTooltip
  };
};

export default useMapClickTooltip;
