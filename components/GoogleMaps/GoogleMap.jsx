import React, { useState, useContext } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useDelayedStateReset } from "@hooks";
import { MapSearchContext } from "contexts/MapSearchContext";
import GoogleMapLoading from "./GoogleMapLoading";
import GoogleMapError from "./GoogleMapError";
import GoogleMapSuccess from "./GoogleMapSuccess";
import { useLayerToggle } from "@hooks/use-layers";

const GoogleMap = ({ location, loading, error, refreshLocation }) => {
  const {
    searchVisible,
    setSearchVisible,
    searchedPlaces,
    addSearchedPlace,
    removeSearchedPlace,
    clearSearchedPlaces,
  } = useContext(MapSearchContext);

  const [layers, toggleLayer] = useLayerToggle();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useDelayedStateReset(location && initialLoad, 1000, setInitialLoad);

  const handlePlaceSelect = (place) => {
    clearSearchedPlaces();
    addSearchedPlace(place);
    setSelectedPlace(place);
  };

  return (
    <div className="w-full h-full relative">
      <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY} libraries={["places", "routes"]}>
        {loading && <GoogleMapLoading />}
        {error && <GoogleMapError error={error} />}
        {location && (
          <GoogleMapSuccess
            location={location}
            refreshLocation={refreshLocation}
            layers={layers}
            toggleLayer={toggleLayer}
            searchVisible={searchVisible}
            setSearchVisible={setSearchVisible}
            searchedPlaces={searchedPlaces}
            removeSearchedPlace={removeSearchedPlace}
            selectedPlace={selectedPlace}
            initialLoad={initialLoad}
            handlePlaceSelect={handlePlaceSelect}
          />
        )}
      </APIProvider>
    </div>
  );
};

export default GoogleMap;
