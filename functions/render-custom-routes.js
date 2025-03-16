import React from "react";
import CustomRoutePolyline from "../components/GoogleMaps/CustomRoutePolyline";

/**
 * Renders custom routes as polylines on a map
 *
 * @param {Object} options - Options for rendering custom routes
 * @param {Array} options.displayedCustomRoutes - Array of custom routes to display
 * @param {number} options.selectedCustomRouteIndex - Index of the selected custom route
 * @param {Object} options.routeInfo - Information about the current route
 * @param {boolean} options.isDrawingEnabled - Whether drawing mode is enabled
 * @param {boolean} options.isClient - Whether this is for client view (true) or admin view (false)
 * @returns {React.ReactNode|null} React elements for custom route polylines or null
 */
const renderCustomRoutes = ({
  displayedCustomRoutes,
  selectedCustomRouteIndex,
  routeInfo,
  isDrawingEnabled = false,
  isClient = false,
}) => {
  if (
    (isDrawingEnabled && !isClient) ||
    !displayedCustomRoutes ||
    displayedCustomRoutes.length === 0
  ) {
    return null;
  }

  // Get the current travel mode from routeInfo or default to DRIVING
  const currentTravelMode = routeInfo?.travelMode || "DRIVING";

  // Filter custom routes by travel mode
  const filteredRoutes = displayedCustomRoutes.filter(
    (route) => route.travelMode === currentTravelMode
  );

  if (filteredRoutes.length === 0) {
    return null;
  }

  return filteredRoutes.map((route, index) => (
    <CustomRoutePolyline
      key={`custom-route-${index}`}
      route={route}
      index={index}
      isSelected={index === selectedCustomRouteIndex}
      isClient={isClient}
    />
  ));
};

export default renderCustomRoutes;
