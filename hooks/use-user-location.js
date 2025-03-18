import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to get the user's geolocation
 * @returns {Object} An object containing the user's location, loading state, error, and refresh function
 */
export const useUserLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getLocation = useCallback(() => {
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
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Get location on initial mount
  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { location, loading, error, refreshLocation: getLocation };
};

export default useUserLocation;
