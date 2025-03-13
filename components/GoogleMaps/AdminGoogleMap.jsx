import React, { useEffect } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useColorScheme, useUserLocation, useMapClickTooltip, useQuery } from "@hooks";
import MapClickHandler from "./Handlers/MapClickHandler";
import MapClickTooltip from "./MapClickTooltip";
import AlertMarker from "./AlertMarker";

// Custom TrafficLayer component that's always enabled
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

const AdminGoogleMap = ({ height, options }) => {
  const colorScheme = useColorScheme();
  const { location } = useUserLocation();

  // Default center (Bucharest, Romania)
  const defaultCenter = { lat: 44.4268, lng: 26.1025 };

  // Use user location if available, otherwise use default
  const center = location || defaultCenter;

  // Fetch alerts from the API
  const { data: alertsData, refetch } = useQuery("/alerts", options);
  const alerts = alertsData || [];

  // Handle map click tooltip
  const { clickedLocation, handleMapClick, handleCloseTooltip } = useMapClickTooltip({
    directionsActive: false,
    searchVisible: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 500);

    // Clean up on component unmount
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md" style={{ height }}>
      <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY} libraries={["places"]}>
        <Map
          defaultCenter={center}
          defaultZoom={12}
          mapId={process.env.ADMIN_GOOGLE_MAPS_ID}
          colorScheme={colorScheme}
          gestureHandling="greedy"
          disableDefaultUI={true}
          clickableIcons={false}
        >
          <AdminTrafficLayer />
          <MapClickHandler onMapClick={handleMapClick} />

          {alerts && alerts.map((alert) => <AlertMarker key={alert._id} alert={alert} />)}

          {clickedLocation && (
            <MapClickTooltip position={clickedLocation} onClose={handleCloseTooltip} />
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default AdminGoogleMap;
