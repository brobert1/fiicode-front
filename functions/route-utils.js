/**
 * Check if two routes are the same by comparing their overview_polyline
 *
 * @param {Object} route1 - First route to compare
 * @param {Object} route2 - Second route to compare
 * @returns {boolean} True if routes are the same
 */
const isSameRoute = (route1, route2) => {
  if (!route1 || !route2) return false;

  // Compare overview polyline paths
  if (
    route1.overview_polyline?.points &&
    route2.overview_polyline?.points &&
    route1.overview_polyline.points === route2.overview_polyline.points
  ) {
    return true;
  }

  // Compare legs length
  if (!route1.legs || !route2.legs || route1.legs.length !== route2.legs.length) {
    return false;
  }

  // Compare start and end locations of each leg
  for (let i = 0; i < route1.legs.length; i++) {
    const leg1 = route1.legs[i];
    const leg2 = route2.legs[i];

    if (
      !leg1.start_location ||
      !leg2.start_location ||
      !leg1.end_location ||
      !leg2.end_location
    ) {
      return false;
    }

    // Compare start locations
    if (
      leg1.start_location.lat !== leg2.start_location.lat ||
      leg1.start_location.lng !== leg2.start_location.lng
    ) {
      return false;
    }

    // Compare end locations
    if (
      leg1.end_location.lat !== leg2.end_location.lat ||
      leg1.end_location.lng !== leg2.end_location.lng
    ) {
      return false;
    }
  }

  return true;
};

/**
 * Format distance in meters to a human-readable string
 *
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance
 */
const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

/**
 * Format duration in seconds to a human-readable string
 *
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes} min`;
};

/**
 * Get the appropriate icon for a step based on its travel mode and details
 *
 * @param {Object} step - The step object from directions
 * @returns {string} CSS class for the icon
 */
const getIconForStep = (step) => {
  const travelMode = step.travel_mode;

  if (travelMode === "WALKING") {
    return "fa-walking";
  } else if (travelMode === "BICYCLING") {
    return "fa-bicycle";
  } else if (travelMode === "TRANSIT") {
    return getTransitIcon(step.transit?.line?.vehicle?.type);
  } else if (travelMode === "DRIVING") {
    // Check for specific driving instructions
    const instructions = step.instructions?.toLowerCase() || "";
    if (instructions.includes("turn right")) {
      return "fa-arrow-right";
    } else if (instructions.includes("turn left")) {
      return "fa-arrow-left";
    } else if (
      instructions.includes("merge") ||
      instructions.includes("continue") ||
      instructions.includes("head")
    ) {
      return "fa-arrow-up";
    } else if (instructions.includes("u-turn")) {
      return "fa-arrow-circle-down";
    } else if (instructions.includes("destination")) {
      return "fa-flag-checkered";
    } else if (instructions.includes("roundabout") || instructions.includes("rotary")) {
      return "fa-sync";
    }
    return "fa-car";
  }

  return "fa-arrow-right"; // Default icon
};

/**
 * Get the appropriate icon for a transit vehicle type
 *
 * @param {string} vehicleType - The vehicle type from transit details
 * @returns {string} CSS class for the icon
 */
const getTransitIcon = (vehicleType) => {
  if (!vehicleType) return "fa-bus";

  switch (vehicleType.toLowerCase()) {
    case "bus":
      return "fa-bus";
    case "rail":
    case "train":
    case "commuter_train":
      return "fa-train";
    case "subway":
    case "metro_rail":
      return "fa-subway";
    case "tram":
    case "light_rail":
      return "fa-tram";
    case "ferry":
      return "fa-ship";
    case "cable_car":
    case "gondola_lift":
      return "fa-cable-car";
    case "funicular":
      return "fa-mountain";
    default:
      return "fa-bus";
  }
};

/**
 * Get transit details for a step
 *
 * @param {Object} step - The step object from directions
 * @returns {Object|null} Transit details or null if not a transit step
 */
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

/**
 * Analyze a route and determine its primary characteristics
 *
 * @param {Object} route - The route object from Google Maps API
 * @param {Array} allRoutes - All available routes for comparison
 * @param {string} travelMode - The selected travel mode
 * @returns {Object} Route characteristics with type and description
 */
const characterizeRoute = (route, allRoutes, travelMode) => {
  if (!route || !allRoutes || allRoutes.length === 0) {
    return { type: "default", label: "Route" };
  }

  // Extract key metrics
  const duration = route.legs.reduce((total, leg) => total + leg.duration.value, 0);
  const distance = route.legs.reduce((total, leg) => total + leg.distance.value, 0);
  const steps = route.legs.reduce((total, leg) => total + leg.steps.length, 0);
  const trafficTime = route.legs.reduce((total, leg) => total + (leg.duration_in_traffic?.value || 0), 0);

  // Calculate metrics for all routes
  const allDurations = allRoutes.map(r =>
    r.legs.reduce((total, leg) => total + leg.duration.value, 0)
  );
  const allDistances = allRoutes.map(r =>
    r.legs.reduce((total, leg) => total + leg.distance.value, 0)
  );
  const allSteps = allRoutes.map(r =>
    r.legs.reduce((total, leg) => total + leg.steps.length, 0)
  );

  // Find min values
  const minDuration = Math.min(...allDurations);
  const minDistance = Math.min(...allDistances);
  const minSteps = Math.min(...allSteps);

  // Check if this is the preferred route according to Google
  const isPreferred = route.summary.includes("preferred_route") ||
                      (route === allRoutes[0] && !route.warnings?.length);

  // Determine primary characteristic
  let type = "default";
  let label = "Route";

  if (duration === minDuration && distance === minDistance) {
    type = "optimal";
    label = "Optimal Route";
  } else if (duration === minDuration) {
    type = "fastest";
    label = "Fastest Route";
  } else if (distance === minDistance) {
    type = "shortest";
    label = "Shortest Route";
  } else if (steps === minSteps) {
    type = "simplest";
    label = "Simplest Route";
  }

  // Special cases for different travel modes
  if (travelMode === "DRIVING") {
    // Check for eco-friendly route
    const hasHighways = route.legs.some(leg =>
      leg.steps.some(step => step.instructions?.includes("highway") || step.instructions?.includes("motorway"))
    );

    const hasTraffic = trafficTime > duration * 1.1; // 10% more time due to traffic

    if (!hasHighways && !hasTraffic && distance <= minDistance * 1.1) {
      type = "eco";
      label = "Eco-Friendly Route";
    }

    // Check for scenic route
    const hasScenicKeywords = route.summary.toLowerCase().includes("scenic") ||
                             route.warnings?.some(w => w.toLowerCase().includes("scenic"));

    if (hasScenicKeywords || (distance > minDistance * 1.2 && !hasHighways)) {
      type = "scenic";
      label = "Scenic Route";
    }
  } else if (travelMode === "TRANSIT") {
    // Check for fewer transfers
    const transfers = route.legs.reduce((total, leg) => {
      return total + leg.steps.filter(step => step.travel_mode === "TRANSIT").length - 1;
    }, 0);

    const allTransfers = allRoutes.map(r =>
      r.legs.reduce((total, leg) => {
        return total + leg.steps.filter(step => step.travel_mode === "TRANSIT").length - 1;
      }, 0)
    );

    const minTransfers = Math.min(...allTransfers);

    if (transfers === minTransfers && transfers < 2) {
      type = "convenient";
      label = "Fewer Transfers";
    }
  }

  // If this is the preferred route according to Google
  if (isPreferred && type === "default") {
    type = "recommended";
    label = "Recommended Route";
  }

  return { type, label };
};

export {
  isSameRoute,
  formatDistance,
  formatDuration,
  getIconForStep,
  getTransitIcon,
  getTransitDetails,
  characterizeRoute
};
