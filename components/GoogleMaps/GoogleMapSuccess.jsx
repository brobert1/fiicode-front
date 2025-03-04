import React, { useState, useEffect } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";
import {
  LocationButton,
  MapLayerControls,
  UserLocationMarker,
  PlacesSearch,
  PlaceMarker,
  DirectionsButton,
  MapClickTooltip
} from ".";
import { TrafficLayer, TransitLayer } from "@hooks/use-layers";
import MapHandler from "./Handlers/MapHandler";
import UserLocationHandler from "./Handlers/UserLocationHandler";
import DirectionsHandler from "./Handlers/DirectionsHandler";
import { DirectionsModal } from "@components/Modals";
import RouteInfo from "./RouteInfo";

// Component to handle map click events
const MapClickHandler = ({ onMapClick }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Add a click listener to the map
    const clickListener = map.addListener("click", (e) => {
      // Get the clicked location
      const clickedLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };

      // If this is a POI click, get the placeId
      if (e.placeId) {
        clickedLocation.placeId = e.placeId;
      }

      onMapClick(clickedLocation);
    });

    return () => {
      window.google.maps.event.removeListener(clickListener);
    };
  }, [map, onMapClick]);

  return null;
};

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
  const [directionsVisible, setDirectionsVisible] = useState(false);
  const [directions, setDirections] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [destinationPlace, setDestinationPlace] = useState(null);
  const [directionDestinationId, setDirectionDestinationId] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);

  const handleDirectionsFound = (directionsResult, info) => {
    setDirections(directionsResult);
    setRouteInfo(info);

    // Store the destination ID if it's from a searched place
    if (info.destination && info.destination.id) {
      setDirectionDestinationId(info.destination.id);
    }
  };

  const handleClearDirections = () => {
    // If we have a destination ID from directions, remove it from searched places
    if (directionDestinationId) {
      removeSearchedPlace(directionDestinationId);
      setDirectionDestinationId(null);
    }

    setDirections(null);
    setRouteInfo(null);
    setDestinationPlace(null);
  };

  const handleRouteChange = (newDirections) => {
    setDirections(newDirections);
  };

  const handleDirectionsUpdate = (newDirections, newRouteInfo) => {
    setDirections(newDirections);
    setRouteInfo(newRouteInfo);
  };

  const handleGetDirections = (place) => {
    // Set the destination place and open the directions modal
    setDestinationPlace(place);
    setDirectionsVisible(true);
  };

  const handleMapClick = (location) => {
    // Don't show tooltip if directions are active or search is visible
    if (directions || directionsVisible || searchVisible) return;

    // Close any existing tooltip
    setClickedLocation(null);

    // Set a small timeout to ensure the previous tooltip is closed
    setTimeout(() => {
      setClickedLocation(location);
    }, 10);
  };

  const handleCloseTooltip = () => {
    setClickedLocation(null);
  };

  // Clear destination place when directions modal is closed without getting directions
  useEffect(() => {
    if (!directionsVisible && !directions) {
      setDestinationPlace(null);
    }
  }, [directionsVisible, directions]);

  // Function to handle map load
  const onMapLoad = (map) => {
    // Disable POI click behavior
    if (map) {
      // Load the default map style
      const defaultMapStyle = map.getMapTypeStyles() || [];

      // Add style rules to hide POI icons and labels
      const updatedStyle = [
        ...defaultMapStyle,
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }] // Keep labels visible
        },
        {
          featureType: "poi.business",
          elementType: "labels",
          stylers: [{ visibility: "on" }] // Keep business labels visible
        }
      ];

      // Apply the updated style
      map.setMapTypeStyles(updatedStyle);
    }
  };

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
            onDirectionsUpdate: handleDirectionsUpdate
          }}
          onClearDirections={handleClearDirections}
        />
      )}

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-2">
        <MapLayerControls layers={layers} toggleLayer={toggleLayer} />
        <DirectionsButton
          onClick={() => {
            setDestinationPlace(null); // Clear any previous destination
            setDirectionsVisible(true);
          }}
          isActive={directionsVisible || directions !== null}
        />
        <LocationButton refreshLocation={refreshLocation} userLocation={location} />
      </div>
    </>
  );
};

export default GoogleMapSuccess;
