import React, { useContext, useEffect, useState, useCallback } from "react";
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
import AirQualityLayer from "./Layers/AirQualityLayer";
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
  searchedPlaces,
  removeSearchedPlace,
  selectedPlace,
  initialLoad,
  handlePlaceSelect,
  onStoreHandleGetDirections,
  isTracking
}) => {
  // Add state to track newly selected place
  const [newlySelectedPlaceId, setNewlySelectedPlaceId] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  // Add state for selected leg index
  const [selectedLegIndex, setSelectedLegIndex] = useState(0);

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

    // Reset selected leg index
    setSelectedLegIndex(0);
  };

  // Handle leg selection
  const handleLegSelect = useCallback((legIndex) => {
    setSelectedLegIndex(legIndex);
  }, []);

  const { clickedLocation, handleMapClick, handleCloseTooltip } = useMapClickTooltip({
    directionsActive: directions !== null || directionsVisible,
  });

  // Handler for air quality data from AirQualityLayer
  const handleAirQualityData = useCallback((data) => {
    if (data) {
      setAirQualityData(data);
    }
  }, []);

  // Reset air quality data when the tooltip is closed
  const handleCloseTooltipWithReset = useCallback(() => {
    setAirQualityData(null);
    handleCloseTooltip();
  }, [handleCloseTooltip]);

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

  // Create a wrapper for handlePlaceSelect to track newly selected places
  const handlePlaceSelectWithTracking = (place) => {
    // Call the original handler
    handlePlaceSelect(place);

    // Set the newly selected place ID
    if (place) {
      setNewlySelectedPlaceId(place.id);
      // Reset the ID after a short delay
      setTimeout(() => {
        setNewlySelectedPlaceId(null);
      }, 1000); // Short delay to ensure the marker is rendered
    }
  };

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
        <AirQualityLayer
          visible={layers.airQuality}
          onAirQualityData={layers.airQuality ? handleAirQualityData : null}
        />

        {/* Display friend markers */}
        {friends &&
          friends.map((friend) => (
            <FriendMarker key={friend._id} friend={friend} onGetDirections={handleGetDirections} />
          ))}

        {/* Display alert markers */}
        {alerts && alerts.map((alert) => <AlertMarker key={alert._id} alert={alert} airQualityLayerVisible={layers.airQuality} />)}

        {searchedPlaces
          .filter((place) => place && place.id !== directionDestinationId)
          .map((place) => (
            <PlaceMarker
              key={place.id}
              place={place}
              onClose={removeSearchedPlace}
              onGetDirections={handleGetDirections}
              favouritePlacesData={favouritePlacesData}
              autoOpenInfoWindow={place.id === newlySelectedPlaceId}
            />
          ))}

        {clickedLocation && (
          <MapClickTooltip
            position={clickedLocation}
            onClose={handleCloseTooltipWithReset}
            onGetDirections={handleGetDirections}
            airQualityData={layers.airQuality ? airQualityData : null}
          />
        )}

        {selectedPlace && <MapHandler place={selectedPlace} />}
        {directions && (
          <DirectionsHandler
            directions={directions}
            routeInfo={routeInfo}
            onRouteChange={handleRouteChange}
            onLegSelect={handleLegSelect}
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
        isVisible={true}
        onPlaceSelect={handlePlaceSelectWithTracking}
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
          selectedLegIndex={selectedLegIndex}
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
