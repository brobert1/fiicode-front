import React from "react";
import { Map } from "@vis.gl/react-google-maps";
import {
  LocationButton,
  MapLayerControls,
  UserLocationMarker,
  PlacesSearch,
  PlaceMarker,
  DirectionsButton,
  MapClickTooltip,
} from ".";
import { TrafficLayer, TransitLayer } from "@hooks/use-layers";
import MapHandler from "./Handlers/MapHandler";
import UserLocationHandler from "./Handlers/UserLocationHandler";
import DirectionsHandler from "./Handlers/DirectionsHandler";
import { DirectionsModal } from "@components/Modals";
import RouteInfo from "./RouteInfo";
import { useDirections, useMapClickTooltip, useMapLoad } from "@hooks";
import MapClickHandler from "./Handlers/MapClickHandler";

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

  // Use custom hooks to manage component state and logic
  const {
    directionsVisible,
    setDirectionsVisible,
    directions,
    routeInfo,
    destinationPlace,
    handleDirectionsFound,
    handleClearDirections,
    handleRouteChange,
    handleDirectionsUpdate,
    handleGetDirections,
    openDirectionsModal,
  } = useDirections({ removeSearchedPlace });

  const { clickedLocation, handleMapClick, handleCloseTooltip } = useMapClickTooltip({
    directionsActive: directions !== null || directionsVisible,
    searchVisible,
  });

  const onMapLoad = useMapLoad();

  return (
    <>
      <Map
        defaultCenter={location}
        defaultZoom={15}
        mapId={process.env.GOOGLE_MAPS_ID}
        colorScheme="LIGHT"
        gestureHandling="cooperative"
        disableDefaultUI={true}
        clickableIcons={false}
        onLoad={onMapLoad}
        style={{ width: '100%', height: '100%' }}
        options={{
          fullscreenControl: false,
          scrollwheel: true,
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        <MapClickHandler onMapClick={handleMapClick} />

        <UserLocationMarker
          position={location}
          accuracy={location.accuracy || 20}
          heading={location.heading || null}
          onClick={() => refreshLocation()}
        />

        <TrafficLayer visible={layers.traffic} />
        <TransitLayer visible={layers.transit} />

        {searchedPlaces.map((place) => (
          <PlaceMarker
            key={place.id}
            place={place}
            onClose={removeSearchedPlace}
            onGetDirections={handleGetDirections}
          />
        ))}

        {clickedLocation && (
          <MapClickTooltip
            position={clickedLocation}
            onClose={handleCloseTooltip}
            onGetDirections={handleGetDirections}
          />
        )}

        {selectedPlace && <MapHandler place={selectedPlace} />}
        {directions && (
          <DirectionsHandler
            directions={directions}
            routeInfo={routeInfo}
            onRouteChange={handleRouteChange}
          />
        )}

        <UserLocationHandler location={location} initialLoad={initialLoad} />
      </Map>

      <PlacesSearch
        isVisible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onPlaceSelect={handlePlaceSelect}
        hasActiveDirections={directions !== null}
      />

      <DirectionsModal
        isOpen={directionsVisible}
        hide={() => setDirectionsVisible(false)}
        userLocation={location}
        onDirectionsFound={handleDirectionsFound}
        initialDestination={destinationPlace}
      />

      {directions && (
        <RouteInfo
          directions={directions}
          routeInfo={{
            ...routeInfo,
            onDirectionsUpdate: handleDirectionsUpdate,
          }}
          onClearDirections={handleClearDirections}
        />
      )}

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-2">
        <MapLayerControls layers={layers} toggleLayer={toggleLayer} />
        <DirectionsButton
          onClick={openDirectionsModal}
          isActive={directionsVisible || directions !== null}
        />
        <LocationButton refreshLocation={refreshLocation} userLocation={location} />
      </div>
    </>
  );
};

export default GoogleMapSuccess;
