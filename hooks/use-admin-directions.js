import { useState, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

/**
 * Custom hook to handle directions for admin custom routes
 *
 * @returns {Object} State and handlers for admin directions
 */
const useAdminDirections = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [isBrowser, setIsBrowser] = useState(false);

  const routes = useMapsLibrary("routes");
  const places = useMapsLibrary("places");

  // Check if we're in the browser
  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined');
  }, []);

  // Get directions when origin and destination are set
  useEffect(() => {
    if (!isBrowser || !routes || !origin || !destination) return;

    setIsLoading(true);
    setError(null);

    // Function to geocode a location query
    const geocodeLocation = (locationQuery, callback) => {
      if (!places) {
        callback(null, "Places library not loaded");
        return;
      }

      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address: locationQuery }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results && results.length > 0) {
          const location = results[0].geometry.location;
          callback({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          callback(null, `Geocoding failed for "${locationQuery}": ${status}`);
        }
      });
    };

    // Geocode origin and destination if needed
    const processOrigin = (callback) => {
      if (origin.location.lat && origin.location.lng) {
        // Already has coordinates
        callback(origin.location);
      } else if (origin.location.query) {
        // Need to geocode
        geocodeLocation(origin.location.query, (location, error) => {
          if (location) {
            callback(location);
          } else {
            setIsLoading(false);
            setError(error);
          }
        });
      } else {
        setIsLoading(false);
        setError("Invalid origin location");
      }
    };

    const processDestination = (originLocation, callback) => {
      if (destination.location.lat && destination.location.lng) {
        // Already has coordinates
        callback(originLocation, destination.location);
      } else if (destination.location.query) {
        // Need to geocode
        geocodeLocation(destination.location.query, (location, error) => {
          if (location) {
            callback(originLocation, location);
          } else {
            setIsLoading(false);
            setError(error);
          }
        });
      } else {
        setIsLoading(false);
        setError("Invalid destination location");
      }
    };

    // Process locations and get directions
    processOrigin((originLocation) => {
      processDestination(originLocation, (originLoc, destinationLoc) => {
        const directionsService = new routes.DirectionsService();

        const request = {
          origin: originLoc,
          destination: destinationLoc,
          travelMode: window.google.maps.TravelMode[travelMode],
          provideRouteAlternatives: true,
        };

        directionsService.route(request, (result, status) => {
          setIsLoading(false);

          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            setError(`Could not calculate directions: ${status}`);
          }
        });
      });
    });
  }, [isBrowser, routes, places, origin, destination, travelMode]);

  // Set origin and destination
  const setLocations = (originData, destinationData) => {
    setOrigin(originData);
    setDestination(destinationData);
  };

  // Clear directions
  const clearDirections = () => {
    setOrigin(null);
    setDestination(null);
    setDirections(null);
    setError(null);
  };

  return {
    origin,
    destination,
    directions,
    isLoading,
    error,
    travelMode,
    setTravelMode,
    setLocations,
    clearDirections,
  };
};

export default useAdminDirections;
