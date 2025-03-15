import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

/**
 * Custom hook to render directions with unclickable polylines
 *
 * @param {Object} options - Options for the hook
 * @param {Object} options.directions - The directions object from Google Maps API
 * @param {Object} options.routeInfo - Information about the route
 * @returns {Object} References to created elements
 */
const useUnclickableDirections = ({ directions, routeInfo }) => {
  const map = useMap();
  const polylineRefs = useRef([]);
  const rendererRef = useRef(null);

  // Get color based on travel mode for primary route
  const getTravelModeColor = (mode) => {
    switch (mode) {
      case "DRIVING":
        return "#4285F4"; // Google Blue
      case "WALKING":
        return "#0F9D58"; // Google Green
      case "BICYCLING":
        return "#F4B400"; // Google Yellow
      case "TRANSIT":
        return "#DB4437"; // Google Red
      default:
        return "#4285F4"; // Default to blue
    }
  };

  // Get outline color
  const getOutlineColor = (mode) => {
    switch (mode) {
      case "DRIVING":
        return "#1A73E8"; // Darker blue
      case "WALKING":
        return "#0B8043"; // Darker green
      case "BICYCLING":
        return "#F09300"; // Darker yellow
      case "TRANSIT":
        return "#C5221F"; // Darker red
      default:
        return "#1A73E8"; // Default to darker blue
    }
  };

  // Get color for alternative routes
  const getAlternativeRouteColor = (index) => {
    // Array of distinct colors for alternative routes
    const alternativeColors = [
      "#DB4437", // Red
      "#0F9D58", // Green
      "#F4B400", // Yellow
      "#9C27B0", // Purple
      "#FF5722", // Deep Orange
      "#00BCD4", // Cyan
      "#795548", // Brown
      "#607D8B", // Blue Grey
      "#E91E63", // Pink
      "#3F51B5", // Indigo
    ];

    // Use modulo to cycle through colors if there are more routes than colors
    return alternativeColors[(index - 1) % alternativeColors.length];
  };

  // Clean up function to remove all polylines and renderer
  const cleanUp = () => {
    // Clean up polylines
    polylineRefs.current.forEach((polyline) => {
      if (polyline) {
        polyline.setMap(null);
      }
    });
    polylineRefs.current = [];

    // Clean up renderer
    if (rendererRef.current) {
      rendererRef.current.setMap(null);
      rendererRef.current = null;
    }
  };

  // Effect to render directions
  useEffect(() => {
    if (!map || !directions) return;

    // Clean up previous elements
    cleanUp();

    // Create a new DirectionsRenderer for markers only
    const renderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressPolylines: true, // We'll create our own polylines
      suppressMarkers: false, // Use Google Maps default markers
      preserveViewport: true, // Don't auto-zoom
    });

    renderer.setDirections(directions);
    rendererRef.current = renderer;

    // Get the travel mode color
    const travelMode = routeInfo?.travelMode || "DRIVING";
    const primaryColor = getTravelModeColor(travelMode);
    const outlineColor = getOutlineColor(travelMode);

    // Create custom polylines for all routes
    if (directions.routes && directions.routes.length > 0) {
      directions.routes.forEach((route, index) => {
        const path = [];

        // Extract path from route legs
        if (route.legs) {
          route.legs.forEach((leg) => {
            if (leg.steps) {
              leg.steps.forEach((step) => {
                if (step.path) {
                  // If step has a detailed path, use it
                  path.push(...step.path);
                } else {
                  // Otherwise use start and end locations
                  path.push(step.start_location);
                  path.push(step.end_location);
                }
              });
            }
          });
        }

        // For primary route, create an outline polyline first for better visibility
        if (index === 0) {
          const outlinePolyline = new window.google.maps.Polyline({
            path: path,
            strokeColor: outlineColor,
            strokeWeight: 8, // Wider than the main line
            strokeOpacity: 0.7,
            zIndex: 9, // Below the main line
            map: map,
            clickable: false, // Make polyline unclickable
          });
          polylineRefs.current.push(outlinePolyline);
        }

        // Create main polyline for this route
        const polyline = new window.google.maps.Polyline({
          path: path,
          strokeColor: index === 0 ? primaryColor : getAlternativeRouteColor(index),
          strokeWeight: index === 0 ? 6 : 5, // Slightly thicker for primary route
          strokeOpacity: 1.0, // Same opacity for all routes
          zIndex: index === 0 ? 10 : 5, // Primary route on top
          map: map,
          clickable: false, // Make polyline unclickable
        });
        polylineRefs.current.push(polyline);
      });

      // Fit the map to the directions
      const bounds = new window.google.maps.LatLngBounds();

      // Add origin and destination to bounds
      if (routeInfo?.origin?.location) {
        bounds.extend(routeInfo.origin.location);
      }

      if (routeInfo?.destination?.location) {
        bounds.extend(routeInfo.destination.location);
      }

      // Add all waypoints from all routes to bounds
      directions.routes.forEach((route) => {
        if (route.legs) {
          route.legs.forEach((leg) => {
            if (leg.steps) {
              leg.steps.forEach((step) => {
                bounds.extend(step.start_location);
                bounds.extend(step.end_location);
              });
            }
          });
        }
      });

      // Fit the map to these bounds
      map.fitBounds(bounds);
    }

    // Clean up on unmount
    return cleanUp;
  }, [map, directions, routeInfo]);

  return {
    polylineRefs,
    rendererRef,
    cleanUp,
  };
};

export default useUnclickableDirections;
