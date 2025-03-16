import React, { useState, useEffect } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import {
  useColorScheme,
  useDirections,
  useUserLocation,
  useCustomRouteModal,
  useMutation,
  useCustomRoutes,
  useDrawingEndpoints,
} from "@hooks";
import UnclickableDirectionsHandler from "../GoogleMaps/Handlers/UnclickableDirectionsHandler";
import RouteDrawingHandler from "../GoogleMaps/Handlers/RouteDrawingHandler";
import CustomDirectionsButton from "../GoogleMaps/Buttons/CustomDirectionsButton";
import { DirectionsModal, CustomRouteModal } from "../Modals";
import AdminRouteInfo from "./AdminRouteInfo";
import DrawingModeIndicator from "./DrawingModeIndicator";
import { TrafficLayer } from "@hooks/use-layers";
import { addCustomRoute } from "@api/admin";
import { renderCustomRoutes } from "@functions";

const AdminRouteMap = ({ height = "600px", onRouteCreated, onClearRoute }) => {
  const colorScheme = useColorScheme();
  const { location } = useUserLocation();
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const customRouteModal = useCustomRouteModal();

  const mutation = useMutation(addCustomRoute, {
    invalidateQueries: ["/custom-routes"],
  });

  // Create a dummy removeSearchedPlace function since we don't have searched places in admin
  const removeSearchedPlace = () => {};

  const {
    directionsVisible,
    setDirectionsVisible,
    directions,
    routeInfo,
    destinationPlace,
    handleDirectionsFound,
    handleClearDirections,
    handleDirectionsUpdate,
    openDirectionsModal,
  } = useDirections({ removeSearchedPlace });

  // Use our custom hooks for drawing endpoints and custom routes
  const { drawingEndpoints } = useDrawingEndpoints({
    directions,
    routeInfo,
  });

  const {
    displayedCustomRoutes,
    selectedCustomRouteIndex,
    setDisplayedCustomRoutes,
    setSelectedCustomRouteIndex,
    handleDirectionsWithCustomRoutes,
    addCustomRoutesToDirections,
  } = useCustomRoutes({
    directions,
    routeInfo,
    onDirectionsUpdate: handleDirectionsUpdate,
  });

  // Default center (Bucharest, Romania)
  const defaultCenter = { lat: 44.4268, lng: 26.1025 };

  // Use user location if available, otherwise use default
  const center = location || defaultCenter;

  // Create a custom clear directions handler that preserves endpoints
  const handleClearDirectionsWithEndpoints = () => {
    // Call the original clear directions function
    handleClearDirections();

    // Clear displayed custom routes to remove polylines from the map
    setDisplayedCustomRoutes([]);
    setSelectedCustomRouteIndex(-1);

    // Note: We intentionally don't clear drawingEndpoints here
    // so they can be used in drawing mode
  };

  // Handle add new route button click
  const handleAddNewRoute = () => {
    // Enable drawing mode
    setIsDrawingEnabled(true);

    // Clear displayed custom routes when entering drawing mode
    setDisplayedCustomRoutes([]);
    setSelectedCustomRouteIndex(-1);

    // We no longer clear directions completely
    // Instead, we just hide the directions panel but keep the endpoints data
    if (directions) {
      // Clear directions from the map but keep the endpoints data
      handleClearDirectionsWithEndpoints();
    }
  };

  // Handle clear route
  const handleClearRoute = () => {
    if (onClearRoute) {
      onClearRoute();
    }
    // We no longer disable drawing mode when clearing the route
    // setIsDrawingEnabled(false);
  };

  // Handle route created
  const handleRouteCreated = (path, showModal = false) => {
    if (showModal && path.length >= 2) {
      // Get the travel mode from drawingEndpoints if available, otherwise from routeInfo or default to DRIVING
      const travelMode = drawingEndpoints?.travelMode || routeInfo?.travelMode || "DRIVING";
      // Pass the drawingEndpoints to the showModal function
      customRouteModal.showModal(path, travelMode, drawingEndpoints);
    }
    if (onRouteCreated) {
      onRouteCreated(path);
    }
  };

  // Function to handle the Add button click
  const handleAddButtonClick = (path) => {
    if (path && path.length >= 2) {
      // Pass the drawingEndpoints to the handleRouteCreated function
      handleRouteCreated(path, true);
    }
  };

  // Handle save route
  const handleSaveRoute = (formData) => {
    // Here you would typically save the route to your backend
    mutation.mutate(formData);
    setIsDrawingEnabled(false);
  };

  // Handle exit drawing mode
  const handleExitDrawingMode = () => {
    setIsDrawingEnabled(false);
    // Clear the route when exiting drawing mode
    if (onClearRoute) {
      onClearRoute();
    }
  };

  // Effect to clear custom routes when drawing mode changes
  useEffect(() => {
    if (isDrawingEnabled) {
      // Clear displayed custom routes when drawing mode is enabled
      setDisplayedCustomRoutes([]);
      setSelectedCustomRouteIndex(-1);
    }
  }, [isDrawingEnabled]);

  // Effect to update displayed custom routes when travel mode changes
  useEffect(() => {
    if (!isDrawingEnabled && displayedCustomRoutes.length > 0 && directions) {
      // When travel mode changes, we need to re-filter the custom routes
      // and update the directions result
      if (routeInfo && directions) {
        // Reset the selected index first
        setSelectedCustomRouteIndex(-1);

        // Re-add custom routes filtered by the new travel mode
        addCustomRoutesToDirections(directions, displayedCustomRoutes, routeInfo);
      }
    }
  }, [routeInfo?.travelMode, isDrawingEnabled]);

  // Custom handler for directions found that adds relevant custom routes
  const handleDirectionsWithCustomRoutesWrapper = (directionsResult, info) => {
    handleDirectionsWithCustomRoutes(directionsResult, info, handleDirectionsFound);
  };

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md relative" style={{ height }}>
      <APIProvider
        apiKey={process.env.GOOGLE_MAPS_API_KEY}
        libraries={["places", "routes", "geometry"]}
      >
        <div className="flex h-full">
          {/* Map Container */}
          <div className={`relative ${directions && !isDrawingEnabled ? "w-1/2" : "w-full"}`}>
            <Map
              defaultCenter={center}
              defaultZoom={12}
              mapId={process.env.ADMIN_GOOGLE_MAPS_ID}
              colorScheme={colorScheme}
              gestureHandling="greedy"
              disableDefaultUI={true}
              clickableIcons={false}
            >
              <TrafficLayer visible={true} />
              <RouteDrawingHandler
                onRouteCreated={handleRouteCreated}
                onClearRoute={handleClearRoute}
                isDrawingEnabled={isDrawingEnabled}
                routeInfo={isDrawingEnabled ? null : routeInfo}
                onAddButtonClick={handleAddButtonClick}
                endpoints={drawingEndpoints}
              />
              {directions && !isDrawingEnabled && (
                <UnclickableDirectionsHandler directions={directions} routeInfo={routeInfo} />
              )}

              {/* Render custom routes directly on the map using the imported function */}
              {renderCustomRoutes({
                displayedCustomRoutes,
                selectedCustomRouteIndex,
                routeInfo,
                isDrawingEnabled,
                isClient: false
              })}
            </Map>

            {/* Directions Button - only show when not in drawing mode and no directions */}
            {!directions && !isDrawingEnabled && (
              <CustomDirectionsButton onClick={openDirectionsModal} />
            )}

            {/* Drawing Mode Indicator */}
            {isDrawingEnabled && <DrawingModeIndicator onExit={handleExitDrawingMode} />}
          </div>

          {/* Route Info Panel */}
          {directions && !isDrawingEnabled && (
            <div className="w-1/2 h-full">
              <AdminRouteInfo
                directions={directions}
                routeInfo={{
                  ...routeInfo,
                  onDirectionsUpdate: handleDirectionsUpdate,
                }}
                onClearDirections={handleClearDirectionsWithEndpoints}
                onAddNewRoute={handleAddNewRoute}
              />
            </div>
          )}
        </div>

        {/* Custom Route Modal */}
        <CustomRouteModal
          isOpen={customRouteModal.isOpen}
          hide={() => {
            customRouteModal.hide();
            // Keep drawing mode enabled when continuing to draw
            setIsDrawingEnabled(true);
            // But clear any existing route data to start fresh
            if (onClearRoute) {
              onClearRoute();
            }
          }}
          routePath={customRouteModal.routePath}
          routeType={customRouteModal.routeType}
          endpoints={customRouteModal.endpoints}
          onSave={handleSaveRoute}
        />

        <DirectionsModal
          isOpen={directionsVisible}
          hide={() => setDirectionsVisible(false)}
          userLocation={location}
          onDirectionsFound={handleDirectionsWithCustomRoutesWrapper}
          initialDestination={destinationPlace}
        />
      </APIProvider>
    </div>
  );
};

export default AdminRouteMap;
