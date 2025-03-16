import { useState, useCallback } from 'react';

/**
 * Custom hook to handle getting directions to a favorite place
 *
 * @param {Object} options - Options for the hook
 * @param {Function} options.onGetDirections - Function to get directions (passed from parent)
 * @param {Function} options.onMenuClose - Optional function to close a menu or modal after getting directions
 * @returns {Object} State and handler functions for favorite place directions
 */
const useFavoriteDirections = ({ onGetDirections, onMenuClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle getting directions to a place
   *
   * This function handles different place formats:
   * - Favorite places from the API (with _id, latitude, longitude)
   * - Google Maps places (with id, location.lat, location.lng)
   * - Custom places (with any combination of the above)
   *
   * @param {Object} place - The place to get directions to
   */
  const handleFavoriteDirections = useCallback((place) => {
    setIsLoading(true);
    setError(null);

    // Create a place object in the format expected by the directions system
    const placeForDirections = {
      // Use id from either _id or id field
      id: place._id || place.id,
      // Use name from address, name, or description field
      name: place.address || place.name || place.description || 'Selected Location',
      // Use address from address field or name as fallback
      address: place.address || place.name || place.description || 'Selected Location',
      // Handle different location formats
      location: {
        lat: place.latitude || (place.location && place.location.lat) || place.lat,
        lng: place.longitude || (place.location && place.location.lng) || place.lng
      }
    };

    // Use the onGetDirections prop passed from the parent
    if (onGetDirections) {
      try {
        onGetDirections(placeForDirections);

        // Close the menu if a close function was provided
        if (onMenuClose) {
          onMenuClose();
        }
      } catch (err) {
        console.error("Error getting directions:", err);
        setError("Error getting directions. Please try again.");
        setIsLoading(false);
      }
    } else {
      console.warn("onGetDirections prop is not provided yet. The map might still be initializing.");
      setError("Map is still initializing. Please try again in a moment.");
      setIsLoading(false);
    }
  }, [onGetDirections, onMenuClose]);

  return {
    isLoading,
    error,
    handleFavoriteDirections
  };
};

export default useFavoriteDirections;
