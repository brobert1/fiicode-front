import React, { useState, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import TravelModeSelector from "./TravelModeSelector";

const RouteInfo = ({ directions, routeInfo, onClearDirections }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [originalRoutes, setOriginalRoutes] = useState([]);
  const [selectedTravelMode, setSelectedTravelMode] = useState(routeInfo?.travelMode || "DRIVING");
  const [isChangingMode, setIsChangingMode] = useState(false);
  const [directionsService, setDirectionsService] = useState(null);

  // Load the routes library
  const routesLibrary = useMapsLibrary("routes");

  // Initialize the DirectionsService when the routes library is loaded
  useEffect(() => {
    if (!routesLibrary) return;
    setDirectionsService(new routesLibrary.DirectionsService());
  }, [routesLibrary]);

  // Store the original routes when directions change
  useEffect(() => {
    if (directions && directions.routes) {
      setOriginalRoutes(
        directions.routes.map((route, index) => ({
          route,
          originalIndex: index,
        }))
      );
      setSelectedRouteIndex(0);
    }
  }, [directions]);

  // Update selected travel mode when routeInfo changes
  useEffect(() => {
    if (routeInfo?.travelMode) {
      setSelectedTravelMode(routeInfo.travelMode);
    }
  }, [routeInfo]);

  // Update selected route index when routes are reordered externally (by clicking on the map)
  useEffect(() => {
    if (directions && directions.routes && originalRoutes.length > 0) {
      // Try to find the current primary route in our original routes
      const primaryRoute = directions.routes[0];

      // Find the index of this route in our original routes array
      const newSelectedIndex = originalRoutes.findIndex((item) =>
        isSameRoute(item.route, primaryRoute)
      );

      if (newSelectedIndex !== -1 && newSelectedIndex !== selectedRouteIndex) {
        setSelectedRouteIndex(newSelectedIndex);
      }
    }
  }, [directions, originalRoutes, selectedRouteIndex]);

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

  // Calculate total distance and duration
  const totalDistance = legs.reduce((total, leg) => total + leg.distance.value, 0);
  const totalDuration = legs.reduce((total, leg) => total + leg.duration.value, 0);

  // Format distance
  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  // Format duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  // Handle travel mode change
  const handleTravelModeChange = (newMode) => {
    if (newMode === selectedTravelMode) {
      return;
    }

    if (!directionsService || !routeInfo?.origin || !routeInfo?.destination) {
      console.error("Cannot change travel mode: missing directionsService or route info");
      return;
    }

    setSelectedTravelMode(newMode);
    setIsChangingMode(true);

    const request = {
      origin: routeInfo.origin.location,
      destination: routeInfo.destination.location,
      travelMode: newMode,
      provideRouteAlternatives: true,
    };

    directionsService.route(request, (result, status) => {
      setIsChangingMode(false);

      if (status === routesLibrary.DirectionsStatus.OK) {
        // Update directions with the new travel mode
        if (routeInfo.onDirectionsUpdate) {
          routeInfo.onDirectionsUpdate(result, {
            ...routeInfo,
            travelMode: newMode,
          });
        }
      } else {
        console.error("Directions request failed:", status);
      }
    });
  };

  // Get transit details for a step
  const getTransitDetails = (step) => {
    if (!step.transit || !step.transit.line) return null;

    const line = step.transit.line;
    const vehicle = line.vehicle;
    const departure = step.transit.departure_time?.text || "";
    const arrival = step.transit.arrival_time?.text || "";
    const numStops = step.transit.num_stops || 0;

    return {
      name: line.name || "",
      shortName: line.short_name || "",
      color: line.color || "#1976D2",
      textColor: line.text_color || "white",
      vehicleType: vehicle?.type || "BUS",
      vehicleName: vehicle?.name || "Bus",
      vehicleIcon: vehicle?.icon || null,
      departure,
      arrival,
      numStops,
      departureStop: step.transit.departure_stop?.name || "",
      arrivalStop: step.transit.arrival_stop?.name || "",
    };
  };

  return (
    <div className="absolute top-0 left-0 right-0 bg-white shadow-lg rounded-b-lg z-20 max-h-[60vh] overflow-hidden transition-all duration-300">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="font-semibold text-gray-800">
              {formatDistance(totalDistance)} ({formatDuration(totalDuration)})
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
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

        {/* Travel mode selector with hint */}
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

      {isExpanded && (
        <div className="overflow-y-auto max-h-[40vh] p-4">
          {legs.map((leg, legIndex) => (
            <div key={legIndex} className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <i className="fas fa-circle text-blue-500 text-xs"></i>
                </div>
                <div className="text-sm font-medium">{leg.start_address}</div>
              </div>

              {leg.steps.map((step, stepIndex) => {
                const isTransit = step.travel_mode === "TRANSIT";
                const transitDetails = isTransit ? getTransitDetails(step) : null;

                return (
                  <div key={stepIndex} className="py-2 border-b border-gray-100 last:border-0 ml-4">
                    <div className="flex">
                      <div className="mr-3 pt-1">
                        <i className={`fas ${getIconForStep(step)} text-blue-500`}></i>
                      </div>
                      <div className="flex-1">
                        <div
                          className="text-sm text-gray-700"
                          dangerouslySetInnerHTML={{ __html: step.instructions }}
                        />

                        {/* Distance and duration for this step */}
                        <div className="text-xs text-gray-500 mt-1">
                          {step.distance?.text} · {step.duration?.text}
                        </div>
                      </div>
                    </div>

                    {/* Transit details */}
                    {isTransit && transitDetails && (
                      <div className="ml-8 mt-2 mb-1">
                        <div
                          className="px-2 py-1 rounded-md inline-flex items-center text-sm"
                          style={{
                            backgroundColor: transitDetails.color,
                            color: transitDetails.textColor,
                          }}
                        >
                          <i
                            className={`fas ${getTransitIcon(transitDetails.vehicleType)} mr-1`}
                          ></i>
                          {transitDetails.shortName || transitDetails.name}
                        </div>

                        <div className="flex items-center text-xs text-gray-600 mt-1">
                          <div>
                            <span className="font-medium">{transitDetails.departure}</span>
                            <span className="mx-1">·</span>
                            <span>{transitDetails.departureStop}</span>
                          </div>
                          <i className="fas fa-arrow-right mx-2 text-gray-400"></i>
                          <div>
                            <span className="font-medium">{transitDetails.arrival}</span>
                            <span className="mx-1">·</span>
                            <span>{transitDetails.arrivalStop}</span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          {transitDetails.numStops}{" "}
                          {transitDetails.numStops === 1 ? "stop" : "stops"}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center mt-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                  <i className="fas fa-map-marker-alt text-red-500 text-xs"></i>
                </div>
                <div className="text-sm font-medium">{leg.end_address}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to check if two routes are the same
// We compare the first and last points of each leg as a simple heuristic
const isSameRoute = (route1, route2) => {
  if (!route1 || !route2 || !route1.legs || !route2.legs) return false;
  if (route1.legs.length !== route2.legs.length) return false;

  for (let i = 0; i < route1.legs.length; i++) {
    const leg1 = route1.legs[i];
    const leg2 = route2.legs[i];

    // Compare start and end locations
    if (
      Math.abs(leg1.start_location.lat - leg2.start_location.lat) > 0.0001 ||
      Math.abs(leg1.start_location.lng - leg2.start_location.lng) > 0.0001 ||
      Math.abs(leg1.end_location.lat - leg2.end_location.lat) > 0.0001 ||
      Math.abs(leg1.end_location.lng - leg2.end_location.lng) > 0.0001
    ) {
      return false;
    }

    // Compare distance and duration as additional check
    if (
      Math.abs(leg1.distance.value - leg2.distance.value) > 10 ||
      Math.abs(leg1.duration.value - leg2.duration.value) > 10
    ) {
      return false;
    }
  }

  return true;
};

// Helper function to get an appropriate icon for the step
const getIconForStep = (step) => {
  const travelMode = step.travel_mode;

  if (travelMode === "WALKING") {
    return "fa-walking";
  }

  if (travelMode === "TRANSIT") {
    if (step.transit && step.transit.line && step.transit.line.vehicle) {
      const vehicleType = step.transit.line.vehicle.type;
      return getTransitIcon(vehicleType);
    }
    return "fa-bus";
  }

  // Check for specific maneuvers in driving directions
  const maneuver = step.maneuver;

  if (maneuver) {
    if (maneuver.includes("left")) {
      return "fa-arrow-left";
    }
    if (maneuver.includes("right")) {
      return "fa-arrow-right";
    }
    if (maneuver.includes("uturn")) {
      return "fa-arrow-u-turn";
    }
    if (maneuver.includes("roundabout") || maneuver.includes("rotary")) {
      return "fa-rotate";
    }
  }

  return "fa-road";
};

// Helper function to get transit icon based on vehicle type
const getTransitIcon = (vehicleType) => {
  switch (vehicleType) {
    case "SUBWAY":
    case "METRO_RAIL":
      return "fa-subway";
    case "RAIL":
    case "COMMUTER_TRAIN":
    case "HEAVY_RAIL":
      return "fa-train";
    case "TRAM":
    case "LIGHT_RAIL":
      return "fa-tram";
    case "BUS":
    case "INTERCITY_BUS":
    case "TROLLEYBUS":
      return "fa-bus";
    case "FERRY":
      return "fa-ship";
    case "CABLE_CAR":
    case "GONDOLA_LIFT":
      return "fa-cable-car";
    case "FUNICULAR":
      return "fa-mountain";
    default:
      return "fa-bus";
  }
};

export default RouteInfo;
