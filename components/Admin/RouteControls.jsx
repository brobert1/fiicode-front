import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

const RouteControls = ({
  drawingEnabled,
  polylineRef,
  pathRef,
  markersRef,
  onClearRoute,
  onAddButtonClick
}) => {
  const map = useMap();
  const controlDivRef = useRef(null);
  const addButtonRef = useRef(null);
  const buttonsCreatedRef = useRef(false);

  // Create buttons only once
  useEffect(() => {
    if (!map || !drawingEnabled || buttonsCreatedRef.current) return;

    // Create UI container
    const controlDiv = document.createElement("div");
    controlDiv.className = "bg-white rounded-lg shadow-md p-2 m-2 flex flex-col space-y-2";
    controlDiv.style.margin = "10px";
    controlDivRef.current = controlDiv;

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

    // Add Route Button
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
    addButtonRef.current = addButton;

    // Add buttons to container
    controlDiv.appendChild(clearButton);
    controlDiv.appendChild(addButton);

    // Add the control to the map
    map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);

    buttonsCreatedRef.current = true;

    // Clean up on unmount
    return () => {
      map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].clear();
      buttonsCreatedRef.current = false;
    };
  }, [map, drawingEnabled]);

  // Update Add button visibility separately based on path changes
  useEffect(() => {
    if (!addButtonRef.current) return;

    const updateAddButtonVisibility = () => {
      if (addButtonRef.current) {
        addButtonRef.current.style.display = pathRef.current.length >= 2 ? "block" : "none";
      }
    };

    // Initial update
    updateAddButtonVisibility();

    // Set up a MutationObserver to watch for changes to the polyline's path
    if (polylineRef.current) {
      const path = polylineRef.current.getPath();
      if (path) {
        path.addListener("insert_at", updateAddButtonVisibility);
        path.addListener("remove_at", updateAddButtonVisibility);
        path.addListener("set_at", updateAddButtonVisibility);
      }
    }

    return () => {
      if (polylineRef.current) {
        const path = polylineRef.current.getPath();
        if (path) {
          window.google.maps.event.clearListeners(path, "insert_at");
          window.google.maps.event.clearListeners(path, "remove_at");
          window.google.maps.event.clearListeners(path, "set_at");
        }
      }
    };
  }, [polylineRef, pathRef]);

  // Handle drawing mode being disabled
  useEffect(() => {
    if (!map || !controlDivRef.current) return;

    if (!drawingEnabled && buttonsCreatedRef.current) {
      map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].clear();
      buttonsCreatedRef.current = false;
    } else if (drawingEnabled && !buttonsCreatedRef.current && controlDivRef.current) {
      map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDivRef.current);
      buttonsCreatedRef.current = true;
    }
  }, [map, drawingEnabled]);

  return null;
};

export default RouteControls;
