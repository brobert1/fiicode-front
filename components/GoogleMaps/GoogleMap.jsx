import React, { useState, useContext } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { LocationButton, MapLayerControls, UserLocationMarker, PlacesSearch, PlaceMarker } from ".";
import { TrafficLayer, TransitLayer, useLayerToggle } from "@hooks/use-layers";
import { useDelayedStateReset, useUserLocation } from "@hooks";
import { MapSearchContext } from "contexts/MapSearchContext";
import MapHandler from "./Handlers/MapHandler";
import UserLocationHandler from "./Handlers/UserLocationHandler";

const GoogleMap = () => {
  const { location, loading, error, refreshLocation } = useUserLocation();
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
      <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY} libraries={["places"]}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="flex items-center">
              <i className="fas fa-spinner fa-spin text-blue-500 mr-2"></i>
              <p>Fetching location...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="bg-red-50 text-red-700 p-4 rounded-md shadow-md flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              <p>{error}</p>
            </div>
          </div>
        )}
        {location && (
          <>
            <Map
              defaultCenter={location}
              defaultZoom={15}
              mapId={process.env.GOOGLE_MAPS_ID}
              colorScheme="LIGHT"
              gestureHandling="greedy"
              disableDefaultUI={true}
              clickableIcons={false}
            >
              <UserLocationMarker
                position={location}
                accuracy={location.accuracy || 20}
                heading={location.heading || null}
                onClick={() => refreshLocation()}
              />

              <TrafficLayer visible={layers.traffic} />
              <TransitLayer visible={layers.transit} />

              {searchedPlaces.map((place) => (
                <PlaceMarker key={place.id} place={place} onClose={removeSearchedPlace} />
              ))}

              {selectedPlace && <MapHandler place={selectedPlace} />}

              <UserLocationHandler location={location} initialLoad={initialLoad} />
            </Map>

            <PlacesSearch
              isVisible={searchVisible}
              onClose={() => setSearchVisible(false)}
              onPlaceSelect={handlePlaceSelect}
            />

            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <MapLayerControls layers={layers} toggleLayer={toggleLayer} />
              <LocationButton refreshLocation={refreshLocation} userLocation={location} />
            </div>
          </>
        )}
      </APIProvider>
    </div>
  );
};

export default GoogleMap;
