import { useState, useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

// Component to handle drawing routes
const RouteDrawingHandler = ({ onRouteCreated, onClearRoute, isDrawingEnabled, routeInfo, onAddButtonClick, endpoints }) => {
  const map = useMap();
  const polylineRef = useRef(null);
  const markersRef = useRef([]);
  const pathRef = useRef([]);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  const [drawingEnabled, setDrawingEnabled] = useState(false);

  // Sync with parent's drawing state
  useEffect(() => {
    setDrawingEnabled(isDrawingEnabled);

    // Initialize a new polyline when drawing mode is enabled
    if (isDrawingEnabled && map) {
      // Clear any existing polyline and markers
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }

      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });

      // Reset arrays
      markersRef.current = [];
      pathRef.current = [];

      // Create a new polyline
      polylineRef.current = new window.google.maps.Polyline({
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 5,
        editable: true,
        map: null, // Don't add to map yet
      });

      // Add origin and destination markers if endpoints are provided
      if (endpoints) {
        // Create origin marker with default Google Maps marker
        if (endpoints.origin) {
          const originMarker = new window.google.maps.Marker({
            position: endpoints.origin,
            map: map,
            title: "Origin: " + (endpoints.origin.description || "Start Point"),
            label: "A",
            zIndex: 1000, // Ensure it's on top
          });

          startMarkerRef.current = originMarker;
        }

        // Create destination marker with default Google Maps marker
        if (endpoints.destination) {
          const destinationMarker = new window.google.maps.Marker({
            position: endpoints.destination,
            map: map,
            title: "Destination: " + (endpoints.destination.description || "End Point"),
            label: "B",
            zIndex: 1000, // Ensure it's on top
          });

          endMarkerRef.current = destinationMarker;
        }
      }
    } else if (!isDrawingEnabled) {
      // When drawing mode is disabled, clear all markers and polylines
      clearRoute();
    }

    // Clean up on unmount
    return () => {
      clearRoute();
    };
  }, [isDrawingEnabled, map, routeInfo, endpoints]);

  // Function to clear the route
  const clearRoute = () => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      pathRef.current = [];
    }

    // Clear all markers
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];

    // Clear start and end markers
    if (startMarkerRef.current) {
      startMarkerRef.current.setMap(null);
      startMarkerRef.current = null;
    }

    if (endMarkerRef.current) {
      endMarkerRef.current.setMap(null);
      endMarkerRef.current = null;
    }

    // Notify parent component
    if (onClearRoute) {
      onClearRoute();
    }
  };

  // Function to add a point to the route
  const addRoutePoint = (latLng) => {
    if (!polylineRef.current) return;

    // If this is the first point, set the polyline on the map
    if (pathRef.current.length === 0) {
      polylineRef.current.setMap(map);
    }

    // Add the point to the path
    const path = polylineRef.current.getPath();
    path.push(latLng);
    pathRef.current.push({ lat: latLng.lat(), lng: latLng.lng() });

    // Create a marker for this point
    const marker = new window.google.maps.Marker({
      position: latLng,
      map: map,
      draggable: true,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: "#FF0000",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 2,
      },
    });

    // Add marker to the markers array
    markersRef.current.push(marker);

    // Add drag listener to update the polyline when marker is dragged
    marker.addListener("drag", (e) => {
      const index = markersRef.current.indexOf(marker);
      if (index !== -1) {
        const path = polylineRef.current.getPath();
        path.setAt(index, e.latLng);
        pathRef.current[index] = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      }
    });

    // Add dragend listener to update the path reference
    marker.addListener("dragend", () => {
      if (onRouteCreated) {
        onRouteCreated(pathRef.current);
      }
    });

    // Notify parent component without showing modal
    if (onRouteCreated) {
      onRouteCreated(pathRef.current);
    }
  };

  // Set up map click listener when drawing is enabled
  useEffect(() => {
    if (!map) return;
    let clickListener = null;

    if (drawingEnabled) {
      clickListener = map.addListener("click", (e) => {
        if (drawingEnabled) {
          addRoutePoint(e.latLng);
        }
      });
    }

    return () => {
      if (clickListener) {
        window.google.maps.event.removeListener(clickListener);
      }
    };
  }, [map, drawingEnabled]);

  // Add controls to the map when drawing is enabled
  useEffect(() => {
    if (!map || !drawingEnabled) return;

    // Create UI container
    const controlDiv = document.createElement("div");
    controlDiv.className = "bg-white rounded-lg shadow-md p-2 m-2 flex flex-col space-y-2";
    controlDiv.style.margin = "10px";

    // Clear Route Button
    const clearButton = document.createElement("button");
    clearButton.className = "bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded";
    clearButton.textContent = "Clear Route";
    clearButton.addEventListener("click", () => {
      // Clear the route but stay in drawing mode
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current.setPath([]);
        pathRef.current = [];
      }

      // Clear all markers
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];

      // Notify parent component
      if (onClearRoute) {
        onClearRoute();
      }
    });

    // Add Route Button (only show if there are at least 2 points)
    const addButton = document.createElement("button");
    addButton.className = "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-2";
    addButton.textContent = "Add";
    addButton.style.display = pathRef.current.length >= 2 ? "block" : "none";
    addButton.addEventListener("click", () => {
      if (pathRef.current.length >= 2) {
        // Use the onAddButtonClick function to show the modal
        onAddButtonClick(pathRef.current);
      }
    });

    // Update the Add button visibility when the path changes
    const updateAddButtonVisibility = () => {
      addButton.style.display = pathRef.current.length >= 2 ? "block" : "none";
    };

    // Set up a MutationObserver to watch for changes to the polyline's path
    if (polylineRef.current) {
      const path = polylineRef.current.getPath();
      if (path) {
        path.addListener("insert_at", updateAddButtonVisibility);
        path.addListener("remove_at", updateAddButtonVisibility);
        path.addListener("set_at", updateAddButtonVisibility);
      }
    }

    // Add buttons to container
    controlDiv.appendChild(clearButton);
    controlDiv.appendChild(addButton);

    // Add the control to the map
    map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);

    // Clean up on unmount or when drawing is disabled
    return () => {
      map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].clear();
      if (polylineRef.current) {
        const path = polylineRef.current.getPath();
        if (path) {
          window.google.maps.event.clearListeners(path, "insert_at");
          window.google.maps.event.clearListeners(path, "remove_at");
          window.google.maps.event.clearListeners(path, "set_at");
        }
      }
    };
  }, [map, drawingEnabled, onClearRoute, onAddButtonClick]);

  return null;
};

export default RouteDrawingHandler;
