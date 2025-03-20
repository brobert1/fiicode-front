import { checkAuth, withAuth } from "@auth";
import { MapClientLayout, PWAInstallPrompt } from "@components";
import { GoogleMap } from "@components/GoogleMaps";
import { useUserLocation } from "@hooks";
import withMapSearch from "@components/withMapSearch";
import { useState, useEffect } from "react";
import { useWebSocket } from "../../contexts/WebSocketContext";

const Page = () => {
  const { sendLocationUpdate } = useWebSocket();
  const {
    location,
    loading,
    error,
    refreshLocation,
    isTracking,
    startTracking
  } = useUserLocation({
    watchPosition: true, // Always enable real-time tracking
    watchInterval: 2000,  // Update every 2 seconds to balance performance and accuracy
    onLocationUpdate: (newLocation) => {
      // Send location updates to friends via WebSocket
      if (newLocation && newLocation.lat && newLocation.lng) {
        sendLocationUpdate({
          lat: newLocation.lat,
          lng: newLocation.lng
        });
      }
    }
  });

  const [handleGetDirections, setHandleGetDirections] = useState(null);

  const storeHandleGetDirections = (getDirectionsFunc) => {
    if (getDirectionsFunc) {
      setHandleGetDirections(() => getDirectionsFunc);
    }
  };

  // Only manage resuming tracking when page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isTracking) {
        // Resume tracking when page becomes visible if it's not already tracking
        startTracking();
      }
    };

    // Add event listener for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTracking, startTracking]);

  return (
    <MapClientLayout onGetDirections={handleGetDirections}>
      <div className="h-full w-full">
        <GoogleMap
          location={location}
          loading={loading}
          error={error}
          refreshLocation={refreshLocation}
          onStoreHandleGetDirections={storeHandleGetDirections}
          isTracking={isTracking}
        />
        <PWAInstallPrompt />
      </div>
    </MapClientLayout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(withMapSearch(Page), {
  role: "client",
  checkAuth,
});
