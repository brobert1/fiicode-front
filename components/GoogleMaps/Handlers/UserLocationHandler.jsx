import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

// Component to handle initial map centering on user location
const UserLocationHandler = ({ location, initialLoad }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !location || !initialLoad) return;

    // Center map on user location on initial load
    map.panTo(location);
    map.setZoom(16);
  }, [map, location, initialLoad]);

  return null;
};

export default UserLocationHandler;
