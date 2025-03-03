import React, { createContext, useState } from "react";

export const MapSearchContext = createContext();

export const MapSearchProvider = ({ children }) => {
  const [searchVisible, setSearchVisible] = useState(true);
  const [searchedPlaces, setSearchedPlaces] = useState([]);

  const addSearchedPlace = (place) => {
    setSearchedPlaces((prevPlaces) => {
      // Check if place already exists to avoid duplicates
      const exists = prevPlaces.some((p) => p.id === place.id);
      if (exists) return prevPlaces;
      return [...prevPlaces, place];
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
