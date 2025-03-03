import React from "react";
import { Map } from "@vis.gl/react-google-maps";
import { LocationButton, MapLayerControls, UserLocationMarker, PlacesSearch, PlaceMarker } from ".";
import { TrafficLayer, TransitLayer } from "@hooks/use-layers";
import MapHandler from "./Handlers/MapHandler";
import UserLocationHandler from "./Handlers/UserLocationHandler";

const GoogleMapSuccess = ({
  location,
  refreshLocation,
  layers,
  toggleLayer,
  searchVisible,
  setSearchVisible,
  searchedPlaces,
  removeSearchedPlace,
  selectedPlace,
  initialLoad,
  handlePlaceSelect,
}) => {
  return (
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

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-2">
        <MapLayerControls layers={layers} toggleLayer={toggleLayer} />
        <LocationButton refreshLocation={refreshLocation} userLocation={location} />
      </div>
    </>
  );
};

export default GoogleMapSuccess;
