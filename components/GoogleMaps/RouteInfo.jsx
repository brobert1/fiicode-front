import React from "react";
import { useRouteManager } from "@hooks";
import { RouteHeader, RouteSteps } from ".";
import RidesharingPartners from "./RidesharingPartners";

const RouteInfo = ({ directions, routeInfo, onClearDirections, selectedLegIndex = 0 }) => {
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

  // Validate the selected leg index
  const validLegIndex = Math.min(Math.max(0, selectedLegIndex), legs.length - 1);

  // Get the selected leg for display
  const selectedLeg = legs[validLegIndex];

  // Get all routes for comparison
  const allRoutes = originalRoutes.map(routeObj => routeObj.route);

  // Calculate total distance and duration for all legs
  const totalDistance = legs.reduce((total, leg) => total + leg.distance.value, 0);
  const totalDuration = legs.reduce((total, leg) => total + leg.duration.value, 0);

  // Get the distance and duration for the selected leg only
  const legDistance = selectedLeg.distance.value;
  const legDuration = selectedLeg.duration.value;

  return (
    <div className="absolute top-0 left-0 right-0 bg-white shadow-lg rounded-b-lg z-20 max-h-[80vh] sm:max-h-[70vh] md:max-h-[60vh] overflow-hidden transition-all duration-300">
      <RouteHeader
        totalDistance={totalDistance}
        totalDuration={totalDuration}
        legDistance={legDistance}
        legDuration={legDuration}
        isExpanded={isExpanded}
        toggleExpanded={toggleExpanded}
        onClearDirections={onClearDirections}
        selectedTravelMode={selectedTravelMode}
        handleTravelModeChange={handleTravelModeChange}
        isChangingMode={isChangingMode}
        routeInfo={routeInfo}
        selectedRoute={selectedRoute}
        allRoutes={allRoutes}
        selectedLegIndex={validLegIndex}
        totalLegs={legs.length}
        selectedLeg={selectedLeg}
      />

      {isExpanded && selectedTravelMode === "RIDESHARING" ? (
        <div className="p-4 overflow-auto">
          <RidesharingPartners
            origin={routeInfo?.origin?.location}
            destination={routeInfo?.destination?.location}
          />
        </div>
      ) : isExpanded && (
        <div className="route-steps-container">
          {/* Show steps only for the selected leg */}
          <RouteSteps legs={[selectedLeg]} />
        </div>
      )}
    </div>
  );
};

export default RouteInfo;
