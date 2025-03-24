import React, { createContext, useState } from "react";

export const MapSearchContext = createContext();

export const MapSearchProvider = ({ children }) => {
  const [searchVisible, setSearchVisible] = useState(true);
  const [searchedPlaces, setSearchedPlaces] = useState([]);

  const shouldShowInfoWindow = (place) => {
    if (!place || !place.types || !Array.isArray(place.types)) return false;

    const infoWindowTypes = [
      'street_address', 'route', 'intersection', 'street_number',
      'floor', 'room', 'postal_code'
    ];

    return place.types.some(type => infoWindowTypes.includes(type));
  };

  const addSearchedPlace = (place) => {
    // If place is null, do nothing (don't add it to the array)
    if (!place) return;

    setSearchedPlaces((prevPlaces) => {
      // Check if place already exists to avoid duplicates
      const exists = prevPlaces.some((p) => p.id === place.id);
      if (exists) return prevPlaces;

      // Add showInfoWindow flag to the place object
      const placeWithInfoFlag = {
        ...place,
        showInfoWindow: shouldShowInfoWindow(place)
      };

      return [...prevPlaces, placeWithInfoFlag];
    });
  };

  const removeSearchedPlace = (placeId) => {
    setSearchedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== placeId)
    );
  };

  const clearSearchedPlaces = () => {
    setSearchedPlaces([]);
  };

  return (
    <MapSearchContext.Provider
      value={{
        searchVisible,
        setSearchVisible,
        searchedPlaces,
        addSearchedPlace,
        removeSearchedPlace,
        clearSearchedPlaces
      }}
    >
      {children}
    </MapSearchContext.Provider>
  );
};

export default MapSearchProvider;
