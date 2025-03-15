import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

/**
 * Custom TrafficLayer component that's always enabled for admin maps
 *
 * @returns {null} This component doesn't render any visible elements
 */
const AdminTrafficLayer = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Create a traffic layer
    const trafficLayer = new window.google.maps.TrafficLayer();

    // Set the map on the traffic layer
    trafficLayer.setMap(map);

    return () => {
      // Clean up by removing the traffic layer from the map
      trafficLayer.setMap(null);
    };
  }, [map]);

  return null;
};

export default AdminTrafficLayer;
