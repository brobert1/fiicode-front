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
  FriendMarker,
} from ".";
import { TrafficLayer, TransitLayer, SatelliteLayer } from "@hooks/use-layers";
import MapHandler from "./Handlers/MapHandler";
import UserLocationHandler from "./Handlers/UserLocationHandler";
import DirectionsHandler from "./Handlers/DirectionsHandler";
import MapNavigationHandler from "./Handlers/MapNavigationHandler";
import { DirectionsModal } from "@components/Modals";
import RouteInfo from "./RouteInfo";
import {
  useDirections,
  useMapClickTooltip,
  useMapLoad,
  useQuery,
  useColorScheme,
  useCustomRoutes,
  useMutation,
} from "@hooks";
import MapClickHandler from "./Handlers/MapClickHandler";
import { DirectionsContext } from "../../contexts/DirectionsContext";
import { renderCustomRoutes } from "@functions";
import { updateLocation } from "@api/client";

const GoogleMapSuccess = ({
  location,
  refreshLocation,
  layers,
  toggleLayer,
  searchVisible,
  searchedPlaces,
  removeSearchedPlace,
  selectedPlace,
  initialLoad,
  handlePlaceSelect,
  onStoreHandleGetDirections,
  isTracking
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
    directionDestinationId,
  } = useDirections({ removeSearchedPlace });

  // Store the handleGetDirections function in the parent component
  useEffect(() => {
    if (onStoreHandleGetDirections && handleGetDirections) {
      onStoreHandleGetDirections(handleGetDirections);
    }
  }, [onStoreHandleGetDirections, handleGetDirections]);

  // Create the mutation for manual location updates
  const mutation = useMutation(updateLocation);

  // Custom function to refresh location and update on server
  const refreshLocationAndUpdate = () => {
    // Only call refreshLocation if not tracking
    if (!isTracking) {
      refreshLocation();
    }

    // Always update location on server if we have one
    if (location) {
      mutation.mutate(location);
    }
  };

  // Use custom routes hook to handle custom routes
  const {
    displayedCustomRoutes,
    selectedCustomRouteIndex,
    handleDirectionsWithCustomRoutes,
    setDisplayedCustomRoutes,
    setSelectedCustomRouteIndex,
  } = useCustomRoutes({
    directions,
    routeInfo,
    onDirectionsUpdate: handleDirectionsUpdate,
  });

  // Custom handler to clear both directions and custom routes
  const handleClearDirectionsAndCustomRoutes = () => {
    // Clear directions
    handleClearDirections();

    // Clear custom routes
    setDisplayedCustomRoutes([]);
    setSelectedCustomRouteIndex(-1);
  };

  const { clickedLocation, handleMapClick, handleCloseTooltip } = useMapClickTooltip({
    directionsActive: directions !== null || directionsVisible,
    searchVisible,
  });

  // Fetch alerts from the API
  const { data: alertsData } = useQuery("/alerts");
  const { data: favouritePlacesData } = useQuery("/client/favourite-places");
  const { data: friendsData } = useQuery("/client/friends");
  const alerts = alertsData || [];
  const friends = friendsData || [];

  // Get color scheme based on time of day
  const colorScheme = useColorScheme();

  const onMapLoad = useMapLoad();

  // Get the setDirections function from the DirectionsContext
  const { setDirections: setGlobalDirections } = useContext(DirectionsContext) || {
    setDirections: () => {},
  };

  // Update the global directions state when local directions change
  useEffect(() => {
    setGlobalDirections(directions);
  }, [directions, setGlobalDirections]);

  // Custom handler for directions found that adds relevant custom routes
  const handleDirectionsWithCustomRoutesWrapper = (directionsResult, info) => {
    handleDirectionsWithCustomRoutes(directionsResult, info, handleDirectionsFound);
  };

  // Dummy function for setSearchVisible - never hide search
  const setSearchVisible = () => {};

  return (
    <>
      <Map
        defaultCenter={location}
        defaultZoom={15}
        mapId={process.env.GOOGLE_MAPS_ID}
        colorScheme={colorScheme}
        gestureHandling="greedy"
        disableDefaultUI={true}
        clickableIcons={false} // Disable default POI click behavior
        onLoad={onMapLoad}
      >
        <MapClickHandler onMapClick={handleMapClick} />
        <MapNavigationHandler />

        <UserLocationMarker
          position={location}
          accuracy={location.accuracy || 20}
          heading={location.heading || null}
          pulseEffect={isTracking}
        />

        <TrafficLayer visible={layers.traffic} />
        <TransitLayer visible={layers.transit} />
        <SatelliteLayer visible={layers.satellite} />

        {/* Display friend markers */}
        {friends &&
          friends.map((friend) => (
            <FriendMarker key={friend._id} friend={friend} onGetDirections={handleGetDirections} />
          ))}

        {/* Display alert markers */}
        {alerts && alerts.map((alert) => <AlertMarker key={alert._id} alert={alert} />)}

        {searchedPlaces
          .filter((place) => place.id !== directionDestinationId)
          .map((place) => (
            <PlaceMarker
              key={place.id}
              place={place}
              onClose={removeSearchedPlace}
              onGetDirections={handleGetDirections}
              favouritePlacesData={favouritePlacesData}
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

        {/* Render custom routes directly on the map using the imported function */}
        {renderCustomRoutes({
          displayedCustomRoutes,
          selectedCustomRouteIndex,
          routeInfo,
          isClient: true,
        })}

        <UserLocationHandler location={location} initialLoad={initialLoad} />
      </Map>

      <PlacesSearch
        isVisible={searchVisible}
        onClose={setSearchVisible}
        onPlaceSelect={handlePlaceSelect}
        hasActiveDirections={directions !== null}
      />

      <DirectionsModal
        isOpen={directionsVisible}
        hide={() => setDirectionsVisible(false)}
        userLocation={location}
        onDirectionsFound={handleDirectionsWithCustomRoutesWrapper}
        initialDestination={destinationPlace}
      />

      {directions && (
        <RouteInfo
          directions={directions}
          routeInfo={{
            ...routeInfo,
            onDirectionsUpdate: handleDirectionsUpdate,
          }}
          onClearDirections={handleClearDirectionsAndCustomRoutes}
        />
      )}

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-2">
        <MapLayerControls layers={layers} toggleLayer={toggleLayer} />
        <DirectionsButton
          onClick={() => setDirectionsVisible(true)}
          disabled={directionsVisible}
        />
        <LocationButton
          refreshLocation={refreshLocationAndUpdate}
          userLocation={location}
          isTracking={isTracking}
        />
      </div>
    </>
  );
};

export default GoogleMapSuccess;
