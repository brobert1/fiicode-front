import { useState, useEffect } from 'react';
import { useMapsLibrary } from "@vis.gl/react-google-maps";

/**
 * Get a user-friendly place type
 *
 * @param {Array} types - Array of place types from Google Places API
 * @returns {string|null} User-friendly place type or null
 */
const getPlaceType = (types) => {
  if (!types || types.length === 0) return null;

  const typeMap = {
    'restaurant': 'Restaurant',
    'cafe': 'Café',
    'bar': 'Bar',
    'lodging': 'Hotel',
    'store': 'Store',
    'shopping_mall': 'Shopping Mall',
    'supermarket': 'Supermarket',
    'grocery_or_supermarket': 'Grocery Store',
    'bank': 'Bank',
    'hospital': 'Hospital',
    'pharmacy': 'Pharmacy',
    'school': 'School',
    'park': 'Park',
    'museum': 'Museum',
    'gas_station': 'Gas Station',
    'train_station': 'Train Station',
    'bus_station': 'Bus Station',
    'airport': 'Airport'
  };

  for (const type of types) {
    if (typeMap[type]) return typeMap[type];
  }

  return null;
};

/**
 * Custom hook to fetch place information from a location
 *
 * @param {Object} position - The position object with lat, lng and optionally placeId
 * @returns {Object} Place information state
 */
const usePlaceInfo = (position) => {
  const [placeInfo, setPlaceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !position) return;

    setLoading(true);
    setError(null);

    // Create a PlacesService instance
    const placesService = new places.PlacesService(document.createElement("div"));

    // If we have a placeId from a POI click, use that
    if (position.placeId) {
      placesService.getDetails({
        placeId: position.placeId,
        fields: ["name", "formatted_address", "place_id", "geometry", "types"]
      }, (place, status) => {
        setLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          setPlaceInfo({
            id: place.place_id,
            name: place.name,
            address: place.formatted_address,
            type: getPlaceType(place.types),
            location: {
              lat: position.lat,
              lng: position.lng
            }
          });
        } else {
          // Fallback to geocoding if place details fail
          geocodeLocation();
        }
      });
    } else if (position.name) {
      // If we already have name from a POI click, use it directly
      setLoading(false);
      setPlaceInfo({
        id: position.placeId || `location-${position.lat}-${position.lng}`,
        name: position.name,
        address: position.address || `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`,
        location: {
          lat: position.lat,
          lng: position.lng
        }
      });
    } else {
      // Try to get place information from the clicked location using geocoding
      geocodeLocation();
    }

    // Helper function to geocode the location
    function geocodeLocation() {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        setLoading(false);
        if (status === "OK" && results && results.length > 0) {
          const result = results[0];
          setPlaceInfo({
            id: `location-${position.lat}-${position.lng}`,
            name: result.formatted_address.split(',')[0],
            address: result.formatted_address,
            location: {
              lat: position.lat,
              lng: position.lng
            }
          });
        } else {
          setError("Could not find information for this location");
          setPlaceInfo({
            id: `location-${position.lat}-${position.lng}`,
            name: "Selected Location",
            address: `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`,
            location: {
              lat: position.lat,
              lng: position.lng
            }
          });
        }
      });
    }
  }, [places, position]);

  return { placeInfo, loading, error };
};

export default usePlaceInfo;
