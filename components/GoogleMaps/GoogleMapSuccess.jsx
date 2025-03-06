import React, { useContext, useEffect } from "react";
import { Map } from "@vis.gl/react-google-maps";
import {
  LocationButton,
  MapLayerControls,
  UserLocationMarker,
  PlacesSearch,
  PlaceMarker,
  DirectionsButton,
  MapClickTooltip,
  AlertMarker,
} from ".";
import { TrafficLayer, TransitLayer } from "@hooks/use-layers";
import MapHandler from "./Handlers/MapHandler";
import UserLocationHandler from "./Handlers/UserLocationHandler";
import DirectionsHandler from "./Handlers/DirectionsHandler";
import { DirectionsModal } from "@components/Modals";
import RouteInfo from "./RouteInfo";
import { useDirections, useMapClickTooltip, useMapLoad, useQuery } from "@hooks";
import MapClickHandler from "./Handlers/MapClickHandler";
import { DirectionsContext } from "../../contexts/DirectionsContext";

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

  // Fetch alerts from the API
  const { data: alertsData } = useQuery("/client/alerts");
  const alerts = alertsData || [];

  const onMapLoad = useMapLoad();

  // Get the setDirections function from the DirectionsContext
  const { setDirections: setGlobalDirections } = useContext(DirectionsContext) || {
    setDirections: () => {},
  };

  // Update the global directions state when local directions change
  useEffect(() => {
    setGlobalDirections(directions);
  }, [directions, setGlobalDirections]);

  // Hide search when directions are found
  useEffect(() => {
    if (directions) {
      setSearchVisible(false);
    }
  }, [directions, setSearchVisible]);

  return (
    <>
      <Map
        defaultCenter={location}
        defaultZoom={15}
        mapId={process.env.GOOGLE_MAPS_ID}
        colorScheme="LIGHT"
        gestureHandling="greedy"
        disableDefaultUI={true}
        clickableIcons={false} // Disable default POI click behavior
        onLoad={onMapLoad}
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

        {/* Display alert markers */}
        {alerts && alerts.map((alert) => <AlertMarker key={alert._id} alert={alert} />)}

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
