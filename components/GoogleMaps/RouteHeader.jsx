import React from "react";
import { formatDistance, formatDuration } from "@functions";
import { characterizeRoute } from "@functions/route-utils";
import TravelModeSelector from "./TravelModeSelector";
import RouteCharacteristic from "./RouteCharacteristic";

const RouteHeader = ({
  totalDistance,
  totalDuration,
  legDistance,
  legDuration,
  isExpanded,
  toggleExpanded,
  onClearDirections,
  selectedTravelMode,
  handleTravelModeChange,
  isChangingMode,
  routeInfo,
  selectedRoute,
  allRoutes,
  selectedLegIndex,
  totalLegs,
  selectedLeg,
}) => {
  // Get route characteristics
  const routeCharacteristics = characterizeRoute(selectedRoute, allRoutes, selectedTravelMode);

  // Check if there are waypoints in the route info
  const hasWaypoints = routeInfo?.waypoints && routeInfo.waypoints.length > 0;

  // Determine if we're showing the full route or just a segment
  const isShowingSegment = hasWaypoints && totalLegs > 1;

  return (
    <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
            {isShowingSegment ? (
              <>
                <span className="text-blue-600">Segment {selectedLegIndex + 1}</span>: {formatDistance(legDistance)} ({formatDuration(legDuration)})
                <span className="ml-2 text-xs text-gray-500">
                  Total: {formatDistance(totalDistance)} ({formatDuration(totalDuration)})
                </span>
              </>
            ) : (
              <>
                {formatDistance(totalDistance)} ({formatDuration(totalDuration)})
              </>
            )}
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleExpanded}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2"
            title={isExpanded ? "Collapse" : "Expand"}
            aria-label={isExpanded ? "Collapse route details" : "Expand route details"}
          >
            <i className={`fas fa-chevron-${isExpanded ? "up" : "down"}`}></i>
          </button>
          <button
            onClick={onClearDirections}
            className="text-gray-500 hover:text-red-500 transition-colors p-2"
            title="Close"
            aria-label="Close route details"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="mt-2 mb-2">
        <RouteCharacteristic type={routeCharacteristics.type} label={routeCharacteristics.label} />
      </div>

      <div className="mt-2 mb-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">
            <i className="fas fa-info-circle mr-1"></i>
            Choose how you want to travel:
          </span>
        </div>
        <TravelModeSelector
          selectedMode={selectedTravelMode}
          onChange={handleTravelModeChange}
          isLoading={isChangingMode}
          loadingMode={selectedTravelMode}
          className="mb-2"
        />
      </div>

      <div className="flex flex-col text-xs sm:text-sm text-gray-600 mt-3">
        {/* Route Overview */}
        {isShowingSegment && (
          <div className="mb-2 text-sm font-medium text-blue-600">
            Route Overview <span className="text-gray-400">({totalLegs} segments)</span>
          </div>
        )}

        {/* Origin */}
        <div className="flex items-center">
          <div className="w-6 flex justify-center">
            <i className="fas fa-circle text-blue-500 text-xs"></i>
          </div>
          <div className="flex-1 truncate">
            <span className={`font-medium ${isShowingSegment && selectedLegIndex === 0 ? "text-blue-600" : ""}`}>
              {routeInfo.origin.description}
            </span>
          </div>
        </div>

        {/* Waypoints */}
        {hasWaypoints && (
          <div className="ml-3">
            {routeInfo.waypoints.map((waypoint, index) => (
              <div key={`waypoint-${index}`} className="flex items-center mt-1">
                <div className="w-6 flex justify-center">
                  <i className={`fas fa-map-pin ${selectedLegIndex === index + 1 || selectedLegIndex === index ? "text-blue-500" : "text-yellow-500"} text-xs`}></i>
                </div>
                <div className="truncate">
                  <span className={`font-medium ${isShowingSegment && (selectedLegIndex === index + 1 || selectedLegIndex === index) ? "text-blue-600" : ""}`}>
                    {waypoint.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Destination */}
        <div className="flex items-center mt-1">
          <div className="w-6 flex justify-center">
            <i className="fas fa-map-marker-alt text-red-500 text-xs"></i>
          </div>
          <div className="flex-1 truncate">
            <span className={`font-medium ${isShowingSegment && selectedLegIndex === totalLegs - 1 ? "text-blue-600" : ""}`}>
              {routeInfo.destination.description}
            </span>
          </div>
        </div>

        {/* Current Segment Info */}
        {isShowingSegment && selectedLeg && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md">
            <div className="font-medium text-sm text-blue-700 mb-1">Current Segment</div>
            <div className="flex items-center mt-1">
              <i className="fas fa-arrow-right text-blue-500 mr-2"></i>
              <div>
                <div>{selectedLeg.start_address}</div>
                <div className="text-blue-700">↓ {formatDistance(legDistance)} · {formatDuration(legDuration)}</div>
                <div>{selectedLeg.end_address}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteHeader;
