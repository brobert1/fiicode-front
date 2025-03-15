import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

const CustomRoutePolyline = ({ route, index, isSelected, isClient = false }) => {
  const map = useMap();
  const polylineRef = useRef(null);
  const outlinePolylineRef = useRef(null);

  // Get color based on index and selection status
  const getColor = () => {
    // For client view, use Google Maps colors
    if (isClient) {
      if (isSelected) {
        return "#4285F4"; // Google Blue for primary route
      } else {
        return "#A0A0A0"; // Gray for alternative routes
      }
    }

    // For admin view, use distinct colors
    if (isSelected) {
      return "#4285F4"; // Google Blue for selected route
    }

    // Custom color palette for custom routes - using more distinct colors
    // that are different from Google's default route colors
    const customRouteColors = [
      "#8E44AD", // Purple
      "#16A085", // Green-Teal
      "#D35400", // Orange
      "#2980B9", // Blue
      "#C0392B", // Red
      "#27AE60", // Emerald
      "#F39C12", // Yellow
      "#1ABC9C", // Turquoise
      "#E74C3C", // Bright Red
      "#3498DB", // Light Blue
    ];

    return customRouteColors[index % customRouteColors.length];
  };

  // Get outline color for selected routes
  const getOutlineColor = () => {
    if (isClient) {
      if (isSelected) {
        return "#1A73E8"; // Darker blue for primary route outline
      }
      return null; // No outline for alternative routes
    }

    return isSelected ? "#1A73E8" : null; // Only outline selected routes
  };

  // Cleanup function to remove polylines from map
  const cleanupPolylines = () => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (outlinePolylineRef.current) {
      outlinePolylineRef.current.setMap(null);
      outlinePolylineRef.current = null;
    }
  };

  useEffect(() => {
    if (!map || !route || !route.routePath) {
      // Clean up if map or route is not available
      cleanupPolylines();
      return;
    }

    // Clean up previous polylines if they exist
    cleanupPolylines();

    // Convert route path to Google Maps LatLng objects
    const path = route.routePath.map(
      (point) => new window.google.maps.LatLng(point.lat, point.lng)
    );

    // Get styling based on context and selection
    const strokeColor = getColor();
    const outlineColor = getOutlineColor();

    // For client view, match Google Maps styling
    const strokeWeight = isClient
      ? isSelected
        ? 5
        : 4 // Google Maps uses thinner lines
      : isSelected
      ? 7
      : 6; // Admin view uses thicker lines

    const strokeOpacity = isClient
      ? isSelected
        ? 1.0
        : 0.5 // Google Maps uses lower opacity for alternative routes
      : 0.9; // Admin view uses consistent opacity

    const zIndex = isClient
      ? isSelected
        ? 10
        : 5 // Google Maps z-index
      : isSelected
      ? 12
      : 11; // Admin view z-index

    // Create outline polyline for selected routes (gives a border effect)
    if (outlineColor) {
      const outlinePolyline = new window.google.maps.Polyline({
        path: path,
        strokeColor: outlineColor,
        strokeWeight: strokeWeight + 2, // Wider than the main line
        strokeOpacity: 0.7,
        zIndex: zIndex - 1, // Below the main line
        map: map,
        clickable: false,
      });

      outlinePolylineRef.current = outlinePolyline;
    }

    // Create the main polyline
    const newPolyline = new window.google.maps.Polyline({
      path: path,
      strokeColor: strokeColor,
      strokeWeight: strokeWeight,
      strokeOpacity: strokeOpacity,
      zIndex: zIndex,
      map: map,
      clickable: false,
    });

    // Store reference to polyline for cleanup
    polylineRef.current = newPolyline;

    // Clean up function
    return cleanupPolylines;
  }, [map, route, index, isSelected, isClient]);

  return null;
};

export default CustomRoutePolyline;
