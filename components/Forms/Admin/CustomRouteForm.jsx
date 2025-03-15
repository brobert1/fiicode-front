import React from "react";
import { Button } from "@components";
import { formatDistance, formatDuration, calculateEstimatedDuration } from "@functions";

const CustomRouteForm = ({ onSubmit, routeData, handleContinueDrawing }) => {
  // Extract data from routeData
  const routePath = routeData?.routePath || [];
  const routeType = routeData?.routeType || "DRIVING";
  const endpoints = routeData?.endpoints || {};

  // Get origin and destination coordinates
  const origin = endpoints?.origin || (routePath.length > 0 ? routePath[0] : { lat: 0, lng: 0 });
  const destination =
    endpoints?.destination ||
    (routePath.length > 0 ? routePath[routePath.length - 1] : { lat: 0, lng: 0 });

  // Get travel mode
  const travelMode = endpoints?.travelMode || routeType;

  // Calculate distance between points in meters
  const calculatePathDistance = (path) => {
    if (!path || path.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const p1 = new window.google.maps.LatLng(path[i].lat, path[i].lng);
      const p2 = new window.google.maps.LatLng(path[i + 1].lat, path[i + 1].lng);
      totalDistance += window.google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
    }
    return totalDistance;
  };

  // Helper function to get travel mode icon
  const getTravelModeIcon = (mode) => {
    switch (mode) {
      case "DRIVING":
        return "fa-car";
      case "WALKING":
        return "fa-walking";
      default:
        return "fa-car";
    }
  };

  // Helper function to format travel mode
  const formatTravelMode = (mode) => {
    return mode.charAt(0) + mode.slice(1).toLowerCase();
  };

  // Handle save button click
  const handleSave = () => {
    if (onSubmit) {
      // Prepare data for submission
      const formData = {
        origin,
        destination,
        travelMode,
        routePath,
        distance: distanceMeters,
        duration: durationSeconds,
      };
      onSubmit(formData);
    }
  };

  // Calculate the distance and estimated duration
  const distanceMeters = calculatePathDistance(routePath);
  const durationSeconds = calculateEstimatedDuration(distanceMeters, travelMode);

  return (
    <div className="space-y-4">
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-row w-full justify-between gap-2">
            <div className="w-1/3">
              <p className="text-sm text-gray-500">Distance</p>
              <p className="font-semibold">{formatDistance(distanceMeters)}</p>
            </div>
            <div className="w-1/3">
              <p className="text-sm text-gray-500">Est. Time</p>
              <p className="font-semibold">{formatDuration(durationSeconds)}</p>
            </div>
            <div className="w-1/3">
              <p className="text-sm text-gray-500">Points</p>
              <p className="font-semibold">{routePath?.length || 0}</p>
            </div>
          </div>

          {/* Origin coordinates */}
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Origin (Point A)</p>
            <p className="font-mono text-xs bg-gray-100 p-1 rounded">
              {origin.lat.toFixed(6)}, {origin.lng.toFixed(6)}
            </p>
            {origin.description && (
              <p className="text-xs text-gray-500 mt-1">{origin.description}</p>
            )}
          </div>

          {/* Destination coordinates */}
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Destination (Point B)</p>
            <p className="font-mono text-xs bg-gray-100 p-1 rounded">
              {destination.lat.toFixed(6)}, {destination.lng.toFixed(6)}
            </p>
            {destination.description && (
              <p className="text-xs text-gray-500 mt-1">{destination.description}</p>
            )}
          </div>

          {/* Display travel mode */}
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Travel Mode</p>
            <p className="font-semibold flex items-center">
              <i className={`fas ${getTravelModeIcon(travelMode)} mr-2 text-blue-500`}></i>
              {formatTravelMode(travelMode)}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Route Data</p>
          <div className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
            <pre className="text-xs">{JSON.stringify(routePath, null, 2)}</pre>
          </div>
        </div>
      </div>
      <Button
        onClick={handleSave}
        className="button full primary w-full rounded-lg text-base sm:text-sm font-medium p-2.5"
      >
        <i className="fas fa-save mr-1"></i> Save Route
      </Button>
      <Button
        onClick={handleContinueDrawing}
        className="button full secondary w-full rounded-lg text-base sm:text-sm font-medium p-2.5"
      >
        <i className="fas fa-pen mr-1"></i> Continue Drawing
      </Button>
    </div>
  );
};

export default CustomRouteForm;
