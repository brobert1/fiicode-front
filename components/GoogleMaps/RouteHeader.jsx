import React from "react";
import { formatDistance, formatDuration, characterizeRoute } from "@functions/route-utils";
import TravelModeSelector from "./TravelModeSelector";
import RouteCharacteristic from "./RouteCharacteristic";

const RouteHeader = ({
  totalDistance,
  totalDuration,
  isExpanded,
  toggleExpanded,
  onClearDirections,
  selectedTravelMode,
  handleTravelModeChange,
  isChangingMode,
  routeInfo,
  selectedRoute,
  allRoutes,
}) => {
  // Get route characteristics
  const routeCharacteristics = characterizeRoute(selectedRoute, allRoutes, selectedTravelMode);

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="font-semibold text-gray-800">
            {formatDistance(totalDistance)} ({formatDuration(totalDuration)})
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleExpanded}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            <i className={`fas fa-chevron-${isExpanded ? "up" : "down"}`}></i>
          </button>
          <button
            onClick={onClearDirections}
            className="text-gray-500 hover:text-red-500 transition-colors"
            title="Close"
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

      <div className="flex items-center text-sm text-gray-600 mt-1">
        <div className="flex-1 truncate">
          <span className="font-medium">From:</span> {routeInfo.origin.description}
        </div>
        <i className="fas fa-arrow-right mx-2 text-gray-400"></i>
        <div className="flex-1 truncate">
          <span className="font-medium">To:</span> {routeInfo.destination.description}
        </div>
      </div>
    </div>
  );
};

export default RouteHeader;
