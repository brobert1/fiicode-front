import React from "react";
import { useRouteManager } from "@hooks";
import { formatDistance, formatDuration, getTravelModeIcon } from "@functions";
import { Button } from "@components";
import classNames from "@lib/classnames";

const AdminRouteInfo = ({ directions, routeInfo, onClearDirections, onAddNewRoute }) => {
  const { selectedRouteIndex, originalRoutes, selectedTravelMode, handleTravelModeChange } =
    useRouteManager({
      directions,
      routeInfo,
      onDirectionsUpdate: routeInfo?.onDirectionsUpdate,
    });

  // Helper functions
  const calculateTotalDistance = (legs) => {
    return legs.reduce((total, leg) => total + leg.distance.value, 0);
  };

  const calculateTotalDuration = (legs) => {
    return legs.reduce((total, leg) => total + leg.duration.value, 0);
  };

  const findOriginalRouteIndex = (route) => {
    return originalRoutes.findIndex((r) => r.route === route);
  };

  // Add more thorough error checking
  if (
    !directions ||
    !directions.routes ||
    directions.routes.length === 0 ||
    !originalRoutes ||
    originalRoutes.length === 0 ||
    !originalRoutes[selectedRouteIndex] ||
    !originalRoutes[selectedRouteIndex].route ||
    !originalRoutes[selectedRouteIndex].route.legs
  ) {
    return null;
  }

  // Use the selected route for display
  const selectedRoute = originalRoutes[selectedRouteIndex].route;
  const legs = selectedRoute.legs;

  // Get all routes for comparison and filter by travel mode
  const allRoutes = originalRoutes
    .map((routeObj) => routeObj.route)
    .filter(route => {
      // If it's a custom route, check its travel mode
      if (route.isCustomRoute) {
        return route.travelMode === selectedTravelMode;
      }
      // Google routes are always shown for the current travel mode
      return true;
    });

  // Calculate total distance and duration
  const totalDistance = calculateTotalDistance(legs);
  const totalDuration = calculateTotalDuration(legs);

  // Render route item (used for both Google and custom routes)
  const renderRouteItem = (route, index, isCustomRoute = false) => {
    if (!route.legs) return null;

    const distance = calculateTotalDistance(route.legs);
    const duration = calculateTotalDuration(route.legs);
    const originalIndex = findOriginalRouteIndex(route);

    return (
      <div
        key={`${isCustomRoute ? 'custom' : 'google'}-${index}`}
        className={classNames(
          "p-3 rounded-lg mb-2 cursor-pointer",
          originalIndex === selectedRouteIndex
            ? "bg-blue-50 border border-blue-200"
            : isCustomRoute
              ? "bg-green-50 hover:bg-green-100"
              : "bg-gray-50 hover:bg-gray-100"
        )}
      >
        <div className="flex justify-between items-center">
          <div className="font-medium">
            {isCustomRoute ? `Custom Route ${index + 1}` : `Route ${index + 1}`}
          </div>
          <div className="text-sm text-gray-600">
            {isCustomRoute
              ? (route.customRouteData?.name || "Unnamed Route")
              : `${formatDistance(distance)} (${formatDuration(duration)})`
            }
          </div>
        </div>
        {route.summary && (
          <div className="text-sm text-gray-500 mt-1">
            {isCustomRoute ? route.summary : `Via ${route.summary}`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Route Information</h3>
        <Button
          onClick={onClearDirections}
          className="text-red-500 hover:text-red-700"
          title="Clear Directions"
        >
          <i className="fas fa-times"></i>
        </Button>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <i className={`fas ${getTravelModeIcon(selectedTravelMode)} mr-2 text-blue-500`}></i>
          <div>
            <div className="font-medium">
              {formatDistance(totalDistance)} ({formatDuration(totalDuration)})
            </div>
            <div className="text-sm text-gray-500">
              From {routeInfo?.origin?.description} to {routeInfo?.destination?.description}
            </div>
          </div>
        </div>

        {/* Travel Mode Selector */}
        <div className="flex flex-wrap gap-2 mt-4 mb-2">
          {["DRIVING", "WALKING"].map((mode) => (
            <Button
              key={mode}
              onClick={() => handleTravelModeChange(mode)}
              className={classNames(
                "px-3 py-2 rounded-lg flex items-center",
                selectedTravelMode === mode
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <i className={`fas ${getTravelModeIcon(mode)} mr-2`}></i>
              {mode.charAt(0) + mode.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Google Routes Section */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Routes</h4>
        {allRoutes
          .filter(route => !route.isCustomRoute)
          .map((route, index) => renderRouteItem(route, index))}
      </div>

      {/* Custom Routes Section */}
      {allRoutes.some(route => route.isCustomRoute) && (
        <div className="mb-6">
          <h4 className="font-medium mb-2">Custom Routes ({selectedTravelMode})</h4>
          {allRoutes
            .filter(route => route.isCustomRoute)
            .map((route, index) => renderRouteItem(route, index, true))}
        </div>
      )}

      {/* Add New Route Button */}
      <Button
        onClick={onAddNewRoute}
        className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg flex items-center justify-center"
      >
        <i className="fas fa-plus mr-2"></i>
        Add New Route
      </Button>
    </div>
  );
};

export default AdminRouteInfo;
