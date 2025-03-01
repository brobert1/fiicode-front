import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

const MapHandler = ({ place }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;

    // Center the map on the selected place
    if (place.location) {
      // Create a LatLngBounds object
      const bounds = new window.google.maps.LatLngBounds();

      if (place.viewport) {
        // If viewport is available, use it for better fitting
        bounds.extend(
          new window.google.maps.LatLng(place.viewport.northeast.lat, place.viewport.northeast.lng)
        );
        bounds.extend(
          new window.google.maps.LatLng(place.viewport.southwest.lat, place.viewport.southwest.lng)
        );
      } else {
        // Otherwise just use the location point and extend it slightly
        bounds.extend(place.location);

        // Extend bounds slightly to create a better view
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        bounds.extend({
          lat: ne.lat() + 0.001,
          lng: ne.lng() + 0.001,
        });
        bounds.extend({
          lat: sw.lat() - 0.001,
          lng: sw.lng() - 0.001,
        });
      }

      // Fit the map to these bounds
      map.fitBounds(bounds);

      // Set a maximum zoom level
      setTimeout(() => {
        if (map.getZoom() > 17) {
          map.setZoom(17);
        }
      }, 100);
    }
  }, [map, place]);

  return null;
};

export default MapHandler;
