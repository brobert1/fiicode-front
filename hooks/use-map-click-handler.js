import { useEffect } from 'react';
import { useMap } from "@vis.gl/react-google-maps";

/**
 * Custom hook to handle map click events
 *
 * @param {Function} onMapClick - Callback function when map is clicked
 * @returns {null}
 */
const useMapClickHandler = (onMapClick) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Add a click listener to the map
    const clickListener = map.addListener("click", (e) => {
      // Get the clicked location
      const clickedLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };

      // If this is a POI click, get the placeId
      if (e.placeId) {
        clickedLocation.placeId = e.placeId;
      }

      onMapClick(clickedLocation);
    });

    return () => {
      window.google.maps.event.removeListener(clickListener);
    };
  }, [map, onMapClick]);

  return null;
};

export default useMapClickHandler;
