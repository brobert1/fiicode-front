import { useState, useRef, useEffect } from "react";
import { calculateEstimatedDuration } from "@functions";

/**
 * Custom hook to manage custom route drawing functionality
 *
 * @returns {Object} State and handlers for custom route drawing
 */
const useCustomRouteDrawing = () => {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [customPolyline, setCustomPolyline] = useState(null);
  const [customPath, setCustomPath] = useState([]);
  const [showCustomRouteModal, setShowCustomRouteModal] = useState(false);
  const [selectedTravelMode, setSelectedTravelMode] = useState("DRIVING");
  const mapListenerRef = useRef(null);
  const mapRef = useRef(null);

  // Ensure travel mode is always either WALKING or DRIVING
  useEffect(() => {
    if (selectedTravelMode !== 'WALKING' && selectedTravelMode !== 'DRIVING') {
      setSelectedTravelMode('DRIVING');
    }
  }, [selectedTravelMode]);

  // Clean up map listener when component unmounts
  useEffect(() => {
    return () => {
      if (mapListenerRef.current) {
        window.google.maps.event.removeListener(mapListenerRef.current);
        mapListenerRef.current = null;
      }
    };
  }, []);

  // Handle starting drawing mode
  const handleStartDrawing = () => {
    // Reset any existing path and polyline before starting a new drawing
    if (customPolyline) {
      customPolyline.setMap(null);
      setCustomPolyline(null);
    }
    setCustomPath([]);
    setIsDrawingMode(true);
  };

  // Handle map click during drawing mode
  const handleDrawingClick = (e) => {
    if (!isDrawingMode) return;

    // Extract and validate the location data
    let newPoint = null;

    if (e && e.detail && e.detail.latLng) {
      // Handle Map onClick event from @vis.gl/react-google-maps
      newPoint = {
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng
      };

      // Store map reference for later use
      if (e.detail.map && !mapRef.current) {
        mapRef.current = e.detail.map;
      }
    } else if (e && typeof e.lat === 'number' && typeof e.lng === 'number') {
      // Handle direct LatLng object
      newPoint = {
        lat: e.lat,
        lng: e.lng
      };
    } else {
      // Invalid location data
      return;
    }

    const updatedPath = [...customPath, newPoint];
    setCustomPath(updatedPath);

    // If we have a polyline, update its path
    if (customPolyline) {
      customPolyline.setPath(updatedPath);
    } else {
      // Create a new polyline
      const map = e.detail?.map;
      if (!map) return;

      const polyline = new window.google.maps.Polyline({
        path: updatedPath,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 5,
        map: map
      });
      setCustomPolyline(polyline);

      // Add right-click listener to end drawing
      mapListenerRef.current = map.addListener("rightclick", () => {
        if (isDrawingMode && customPath.length > 1) {
          setIsDrawingMode(false);
          setShowCustomRouteModal(true);
        }
      });
    }
  };

  // Clear the current path without exiting drawing mode
  const clearPath = () => {
    if (customPolyline) {
      customPolyline.setMap(null);
      setCustomPolyline(null);
    }
    setCustomPath([]);
  };

  // Calculate distance between points in meters
  const calculatePathDistance = (path) => {
    if (!path || path.length < 2 || !window.google?.maps?.geometry?.spherical) return 0;

    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      totalDistance += window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(path[i].lat, path[i].lng),
        new window.google.maps.LatLng(path[i + 1].lat, path[i + 1].lng)
      );
    }
    return totalDistance;
  };

  // Handle custom route submission
  const handleCustomRouteSubmit = () => {
    if (customPath.length <= 1) return null;

    // Ensure travel mode is either WALKING or DRIVING
    const validTravelMode = selectedTravelMode === 'WALKING' ? 'WALKING' : 'DRIVING';

    // Calculate distance
    const distance = calculatePathDistance(customPath);

    // Calculate estimated duration
    const duration = calculateEstimatedDuration(distance, validTravelMode);

    const routeData = {
      path: customPath,
      distance: distance,
      duration: duration,
      origin: customPath[0],
      destination: customPath[customPath.length - 1],
      travelMode: validTravelMode
    };

    // Reset drawing state
    setCustomPath([]);
    setIsDrawingMode(false);
    setShowCustomRouteModal(false);

    // If we have a polyline reference, remove it from the map
    if (customPolyline) {
      customPolyline.setMap(null);
      setCustomPolyline(null);
    }

    // Remove map listener
    if (mapListenerRef.current) {
      window.google.maps.event.removeListener(mapListenerRef.current);
      mapListenerRef.current = null;
    }

    return routeData;
  };

  // Continue drawing after reviewing
  const handleContinueDrawing = () => {
    setShowCustomRouteModal(false);
    setIsDrawingMode(true);
  };

  // Custom setter for travel mode that ensures only WALKING or DRIVING is set
  const setValidTravelMode = (mode) => {
    if (mode === 'WALKING' || mode === 'DRIVING') {
      setSelectedTravelMode(mode);
    } else {
      setSelectedTravelMode('DRIVING');
    }
  };

  return {
    isDrawingMode,
    setIsDrawingMode,
    customPath,
    showCustomRouteModal,
    setShowCustomRouteModal,
    selectedTravelMode,
    setSelectedTravelMode: setValidTravelMode,
    handleStartDrawing,
    handleDrawingClick,
    handleCustomRouteSubmit,
    handleContinueDrawing,
    calculatePathDistance,
    clearPath
  };
};

export default useCustomRouteDrawing;
