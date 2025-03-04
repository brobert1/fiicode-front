import React, { useState, useEffect } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

const MapClickTooltip = ({ position, onClose, onGetDirections }) => {
  const [placeInfo, setPlaceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(true);

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

  const handleGetDirections = (e) => {
    e.stopPropagation();

    if (onGetDirections && placeInfo) {
      onGetDirections(placeInfo);
    }

    setIsInfoOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleCloseInfo = () => {
    setIsInfoOpen(false);
    if (onClose) {
      onClose();
    }
  };

  // Get a user-friendly place type
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

  return (
    <AdvancedMarker position={position}>
      <div className="relative">
        <div className="relative">
          <div className="w-10 h-10 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform -translate-y-1/2">
            <i className="fas fa-map-marker-alt text-white text-lg"></i>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4">
            <div className="w-0 h-0 border-l-5 border-r-5 border-t-8 border-transparent border-t-red-500"></div>
          </div>
        </div>
      </div>

      {isInfoOpen && (
        <InfoWindow position={position} onCloseClick={handleCloseInfo}>
          <div className="p-2 max-w-xs">
            {loading ? (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-gray-600">Loading...</span>
              </div>
            ) : error ? (
              <div className="text-sm text-red-500">{error}</div>
            ) : placeInfo ? (
              <>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{placeInfo.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseInfo();
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                {placeInfo.type && (
                  <div className="text-xs text-gray-500 -mt-1 mb-1">
                    {placeInfo.type}
                  </div>
                )}

                <p className="text-sm text-gray-600 mb-2">{placeInfo.address}</p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleGetDirections}
                    className="text-xs w-full justify-center bg-blue-500 text-white px-2 py-1 rounded flex items-center hover:bg-blue-600 transition-colors"
                  >
                    <i className="fas fa-directions mr-1"></i> Directions
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default MapClickTooltip;
