import { useCallback } from 'react';

/**
 * Custom hook to handle map load and styling
 *
 * @returns {Function} onMapLoad handler function
 */
const useMapLoad = () => {
  return useCallback((map) => {
    // Disable POI click behavior
    if (map) {
      // Load the default map style
      const defaultMapStyle = map.getMapTypeStyles() || [];

      // Add style rules to hide POI icons and labels
      const updatedStyle = [
        ...defaultMapStyle,
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }] // Keep labels visible
        },
        {
          featureType: "poi.business",
          elementType: "labels",
          stylers: [{ visibility: "on" }] // Keep business labels visible
        }
      ];

      // Apply the updated style
      map.setMapTypeStyles(updatedStyle);
    }
  }, []);
};

export default useMapLoad;
