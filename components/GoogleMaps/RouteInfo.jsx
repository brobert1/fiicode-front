import React from "react";
import { useRouteManager } from "@hooks";
import { RouteHeader, RouteSteps } from ".";


const RouteInfo = ({ directions, routeInfo, onClearDirections }) => {
  const {
    isExpanded,
    toggleExpanded,
    selectedRouteIndex,
    originalRoutes,
    selectedTravelMode,
    isChangingMode,
    handleTravelModeChange
  } = useRouteManager({
    directions,
    routeInfo,
    onDirectionsUpdate: routeInfo?.onDirectionsUpdate
  });

  if (
    !directions ||
    !directions.routes ||
    directions.routes.length === 0 ||
    originalRoutes.length === 0
  ) {
    return null;
  }

  // Use the selected route for display
  const selectedRoute = originalRoutes[selectedRouteIndex].route;
  const legs = selectedRoute.legs;

  // Get all routes for comparison
  const allRoutes = originalRoutes.map(routeObj => routeObj.route);

  // Calculate total distance and duration
  const totalDistance = legs.reduce((total, leg) => total + leg.distance.value, 0);
  const totalDuration = legs.reduce((total, leg) => total + leg.duration.value, 0);

  return (
    <div className="absolute top-0 left-0 right-0 bg-white shadow-lg rounded-b-lg z-20 max-h-[60vh] overflow-hidden transition-all duration-300">
      <RouteHeader
        totalDistance={totalDistance}
        totalDuration={totalDuration}
        isExpanded={isExpanded}
        toggleExpanded={toggleExpanded}
        onClearDirections={onClearDirections}
        selectedTravelMode={selectedTravelMode}
        handleTravelModeChange={handleTravelModeChange}
        isChangingMode={isChangingMode}
        routeInfo={routeInfo}
        selectedRoute={selectedRoute}
        allRoutes={allRoutes}
      />

      {isExpanded && <RouteSteps legs={legs} />}
    </div>
  );
};

export default RouteInfo;
