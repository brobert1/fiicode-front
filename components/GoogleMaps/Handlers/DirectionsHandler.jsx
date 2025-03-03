import { useEffect, useState, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

const DirectionsHandler = ({ directions, routeInfo, onRouteChange }) => {
  const map = useMap();
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const polylineRefs = useRef([]);

  // Clean up polylines when component unmounts or directions change
  useEffect(() => {
    return () => {
      polylineRefs.current.forEach(polyline => {
        if (polyline) {
          window.google.maps.event.clearInstanceListeners(polyline);
          polyline.setMap(null);
        }
      });
      polylineRefs.current = [];
    };
  }, [directions]);

  useEffect(() => {
    if (!map) return;

    // Create a new DirectionsRenderer
    const renderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressPolylines: true, // We'll create our own polylines
      suppressMarkers: false,
      preserveViewport: true // Don't auto-zoom
    });

    setDirectionsRenderer(renderer);

    return () => {
      if (renderer) {
        renderer.setMap(null);
      }
    };
  }, [map]);

  // Get color based on travel mode
  const getTravelModeColor = (travelMode) => {
    switch (travelMode) {
      case "DRIVING":
        return "#4285F4"; // Blue
      case "WALKING":
        return "#0F9D58"; // Green
      case "BICYCLING":
        return "#F4B400"; // Yellow/Gold
      case "TRANSIT":
        return "#DB4437"; // Red
      default:
        return "#4285F4"; // Default blue
    }
  };

  // Get secondary color (for alternative routes) based on travel mode
  const getSecondaryColor = (travelMode) => {
    switch (travelMode) {
      case "DRIVING":
        return "#9EB8E5"; // Light blue
      case "WALKING":
        return "#9ED0B5"; // Light green
      case "BICYCLING":
        return "#F4D88A"; // Light yellow
      case "TRANSIT":
        return "#E8A8A1"; // Light red
      default:
        return "#9E9E9E"; // Default grey
    }
  };

  useEffect(() => {
    if (!directionsRenderer || !directions || !map) return;

    // Clear previous polylines
    polylineRefs.current.forEach(polyline => {
      if (polyline) {
        // Remove event listeners
        window.google.maps.event.clearInstanceListeners(polyline);
        polyline.setMap(null);
      }
    });
    polylineRefs.current = [];

    // Set the directions to display
    directionsRenderer.setDirections(directions);

    // Get the travel mode color
    const travelMode = routeInfo?.travelMode || "DRIVING";
    const primaryColor = getTravelModeColor(travelMode);
    const secondaryColor = getSecondaryColor(travelMode);

    // Create custom polylines for each route
    if (directions.routes && directions.routes.length > 0) {
      directions.routes.forEach((route, index) => {
        const path = [];

        // Extract path from route legs
        if (route.legs) {
          route.legs.forEach(leg => {
            if (leg.steps) {
              leg.steps.forEach(step => {
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

        // Create polyline for this route
        const polyline = new window.google.maps.Polyline({
          path: path,
          strokeColor: index === 0 ? primaryColor : secondaryColor, // Primary color for main route, secondary for alternatives
          strokeWeight: index === 0 ? 5 : 4,
          strokeOpacity: index === 0 ? 0.8 : 0.6,
          zIndex: index === 0 ? 10 : 5, // Primary route on top
          map: map,
          clickable: true, // Make polyline clickable
          cursor: 'pointer' // Change cursor on hover
        });

        // Add click event listener to all polylines
        if (onRouteChange && index > 0) { // Only add click handlers to alternative routes
          polyline.addListener('click', () => {
            handleRouteClick(index);
          });

          // Add hover effects
          polyline.addListener('mouseover', () => {
            polyline.setOptions({
              strokeColor: primaryColor, // Change to primary color on hover
              strokeOpacity: 0.6,
              strokeWeight: 5,
              zIndex: 9 // Above other alternatives but below primary
            });
          });

          polyline.addListener('mouseout', () => {
            polyline.setOptions({
              strokeColor: secondaryColor, // Back to secondary color
              strokeOpacity: 0.6,
              strokeWeight: 4,
              zIndex: 5
            });
          });
        }

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

      // Add all waypoints in all routes to bounds
      directions.routes.forEach(route => {
        if (route.legs) {
          route.legs.forEach(leg => {
            if (leg.steps) {
              leg.steps.forEach(step => {
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
  }, [directionsRenderer, directions, map, routeInfo, onRouteChange]);

  // Handle route click
  const handleRouteClick = (index) => {
    if (!directions || !onRouteChange) return;

    // Create a new directions object with the clicked route moved to the first position
    const newDirections = JSON.parse(JSON.stringify(directions)); // Deep clone

    // Move the clicked route to the first position
    const clickedRoute = newDirections.routes[index];
    const newRoutes = [
      clickedRoute,
      ...newDirections.routes.filter((_, i) => i !== index)
    ];

    newDirections.routes = newRoutes;

    // Update the directions in the parent component
    onRouteChange(newDirections);
  };

  return null;
};

export default DirectionsHandler;
