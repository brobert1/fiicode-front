import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to get the user's geolocation
 * @param {Object} options Configuration options
 * @param {boolean} options.watchPosition Whether to watch position in real-time
 * @param {number} options.watchInterval Minimum time between updates in milliseconds (default: 1000)
 * @returns {Object} An object containing the user's location, loading state, error, tracking status, and control functions
 */
export const useUserLocation = ({
  watchPosition = false,
  watchInterval = 1000
} = {}) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef(null);
  const lastUpdateRef = useRef(0);

  const getLocation = useCallback(() => {
    // If we're already tracking, don't make a new getCurrentPosition call
    // Just use the existing tracking data
    if (isTracking && location) {
      return;
    }

    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          timestamp: new Date().getTime()
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [isTracking, location]);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    // Clear any existing watch
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setIsTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const now = new Date().getTime();

        // Throttle updates to prevent too many re-renders
        if (now - lastUpdateRef.current > watchInterval) {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading,
            timestamp: now
          });

          lastUpdateRef.current = now;
          setLoading(false);
        }
      },
      (error) => {
        setError(error.message);
        setLoading(false);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [watchInterval]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  }, []);

  // Init location and tracking on mount
  useEffect(() => {
    getLocation();

    if (watchPosition) {
      startTracking();
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [getLocation, startTracking, watchPosition]);

  return {
    location,
    loading,
    error,
    isTracking,
    refreshLocation: getLocation,
    startTracking,
    stopTracking
  };
};

export default useUserLocation;
