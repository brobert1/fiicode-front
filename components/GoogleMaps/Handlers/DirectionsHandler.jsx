import { useEffect, useState, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

const DirectionsHandler = ({ directions, routeInfo, onRouteChange }) => {
  const map = useMap();
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const polylineRefs = useRef([]);
  const markerRefs = useRef([]);
  const activeInfoWindow = useRef(null);

  // Clean up polylines and markers when component unmounts or directions change
  useEffect(() => {
    return () => {
      // Clean up polylines
      polylineRefs.current.forEach((polyline) => {
        if (polyline) {
          window.google.maps.event.clearInstanceListeners(polyline);
          polyline.setMap(null);
        }
      });
      polylineRefs.current = [];

      // Clean up markers
      markerRefs.current.forEach((marker) => {
        if (marker) {
          marker.setMap(null);
        }
      });
      markerRefs.current = [];

      // Close any open info window
      if (activeInfoWindow.current) {
        activeInfoWindow.current.close();
        activeInfoWindow.current = null;
      }
    };
  }, [directions]);

  useEffect(() => {
    if (!map) return;

    // Create a new DirectionsRenderer
    const renderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressPolylines: true, // We'll create our own polylines
      suppressMarkers: false,
      preserveViewport: true, // Don't auto-zoom
    });

    setDirectionsRenderer(renderer);

    // Add click listener to the map to close active info window when clicking elsewhere
    const mapClickListener = map.addListener("click", () => {
      if (activeInfoWindow.current) {
        activeInfoWindow.current.close();
      }
    });

    return () => {
      if (renderer) {
        renderer.setMap(null);
      }
      // Remove map click listener
      if (mapClickListener) {
        window.google.maps.event.removeListener(mapClickListener);
      }
    };
  }, [map]);

  // Get color based on travel mode - more vibrant colors
  const getTravelModeColor = (travelMode) => {
    switch (travelMode) {
      case "DRIVING":
        return "#0066FF"; // Brighter blue
      case "WALKING":
        return "#00C853"; // Brighter green
      case "TRANSIT":
        return "#FF3D00"; // Brighter red
      default:
        return "#0066FF"; // Default bright blue
    }
  };

  // Get secondary color (for alternative routes) based on travel mode
  const getSecondaryColor = (travelMode) => {
    switch (travelMode) {
      case "DRIVING":
        return "#B3D1FF"; // Lighter blue with more contrast
      case "WALKING":
        return "#B9F6CA"; // Lighter green with more contrast
      case "TRANSIT":
        return "#FFD0C2"; // Lighter red with more contrast
      default:
        return "#CCCCCC"; // Lighter grey
    }
  };

  // Get outline color for the primary route
  const getOutlineColor = (travelMode) => {
    switch (travelMode) {
      case "DRIVING":
        return "#003380"; // Darker blue
      case "WALKING":
        return "#006428"; // Darker green
      case "TRANSIT":
        return "#BF2600"; // Darker red
      default:
        return "#003380"; // Default darker blue
    }
  };

  // Get icon for transit vehicle type
  const getTransitIcon = (vehicleType) => {
    switch (vehicleType) {
      case "SUBWAY":
      case "METRO_RAIL":
        return "subway";
      case "RAIL":
      case "COMMUTER_TRAIN":
      case "HEAVY_RAIL":
        return "train";
      case "TRAM":
      case "LIGHT_RAIL":
        return "tram";
      case "BUS":
      case "INTERCITY_BUS":
      case "TROLLEYBUS":
        return "bus";
      case "FERRY":
        return "ship";
      default:
        return "bus";
    }
  };

  // Create transfer markers at points where travel mode changes
  const createTransferMarkers = (route) => {
    if (!route.legs || route.legs.length === 0) return;

    route.legs.forEach((leg) => {
      if (!leg.steps || leg.steps.length === 0) return;

      for (let i = 0; i < leg.steps.length - 1; i++) {
        const currentStep = leg.steps[i];
        const nextStep = leg.steps[i + 1];

        // Check if there's a change in travel mode
        if (currentStep.travel_mode !== nextStep.travel_mode) {
          // Create a marker at the transfer point
          const marker = new window.google.maps.Marker({
            position: currentStep.end_location,
            map: map,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#FF3D00",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
            },
            title: `Transfer: ${currentStep.travel_mode} to ${nextStep.travel_mode}`,
            zIndex: 20,
          });

          // Create info window with transfer details
          const infoContent = document.createElement("div");

          // Get transit icon if next step is transit
          let transitIconHtml = "";
          if (
            nextStep.travel_mode === "TRANSIT" &&
            nextStep.transit &&
            nextStep.transit.line &&
            nextStep.transit.line.vehicle
          ) {
            const vehicleType = nextStep.transit.line.vehicle.type;
            const iconName = getTransitIcon(vehicleType);
            transitIconHtml = `<i class="fas fa-${iconName}" style="margin-right: 5px;"></i>`;
          }

          infoContent.innerHTML = `
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">Transfer Point</h3>
              <p style="margin: 0; font-size: 12px;">
                Change from ${currentStep.travel_mode.toLowerCase()} to ${nextStep.travel_mode.toLowerCase()}
              </p>
              ${
                nextStep.travel_mode === "TRANSIT" && nextStep.transit
                  ? `<p style="margin: 4px 0 0 0; font-size: 12px;">
                  ${transitIconHtml}Take ${
                      nextStep.transit.line.short_name || nextStep.transit.line.name || "transit"
                    }
                </p>`
                  : ""
              }
            </div>
          `;

          const infoWindow = new window.google.maps.InfoWindow({
            content: infoContent,
          });

          // Add click listener to show info window
          marker.addListener("click", () => {
            // Close any currently open info window
            if (activeInfoWindow.current) {
              activeInfoWindow.current.close();
            }

            // Open this info window and set it as active
            infoWindow.open(map, marker);
            activeInfoWindow.current = infoWindow;
          });

          markerRefs.current.push(marker);
        }

        // Special case: check for transit line changes (e.g., metro to different metro line)
        if (currentStep.travel_mode === "TRANSIT" && nextStep.travel_mode === "TRANSIT") {
          if (currentStep.transit && nextStep.transit) {
            const currentLine =
              currentStep.transit.line.short_name || currentStep.transit.line.name;
            const nextLine = nextStep.transit.line.short_name || nextStep.transit.line.name;

            if (currentLine !== nextLine) {
              // Get vehicle types for icons
              const currentVehicleType = currentStep.transit.line.vehicle?.type || "BUS";
              const nextVehicleType = nextStep.transit.line.vehicle?.type || "BUS";

              // Create a marker for transit line change
              const marker = new window.google.maps.Marker({
                position: currentStep.end_location,
                map: map,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: "#FF9800", // Orange for transit transfers
                  fillOpacity: 1,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 2,
                },
                title: `Transfer: ${currentLine} to ${nextLine}`,
                zIndex: 20,
              });

              // Create info window with transfer details
              const infoContent = document.createElement("div");
              infoContent.innerHTML = `
                <div style="padding: 10px; max-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">Transit Transfer</h3>
                  <p style="margin: 0; font-size: 12px;">
                    <i class="fas fa-${getTransitIcon(
                      currentVehicleType
                    )}" style="margin-right: 5px;"></i>
                    Exit ${currentLine}
                  </p>
                  <p style="margin: 4px 0 0 0; font-size: 12px;">
                    <i class="fas fa-${getTransitIcon(
                      nextVehicleType
                    )}" style="margin-right: 5px;"></i>
                    Take ${nextLine}
                  </p>
                  <p style="margin: 4px 0 0 0; font-size: 12px;">
                    At ${currentStep.transit.arrival_stop.name}
                  </p>
                </div>
              `;

              const infoWindow = new window.google.maps.InfoWindow({
                content: infoContent,
              });

              // Add click listener to show info window
              marker.addListener("click", () => {
                // Close any currently open info window
                if (activeInfoWindow.current) {
                  activeInfoWindow.current.close();
                }

                // Open this info window and set it as active
                infoWindow.open(map, marker);
                activeInfoWindow.current = infoWindow;
              });

              markerRefs.current.push(marker);
            }
          }
        }
      }
    });
  };

  useEffect(() => {
    if (!directionsRenderer || !directions || !map) return;

    // Clear previous polylines and markers
    polylineRefs.current.forEach((polyline) => {
      if (polyline) {
        // Remove event listeners
        window.google.maps.event.clearInstanceListeners(polyline);
        polyline.setMap(null);
      }
    });
    polylineRefs.current = [];

    markerRefs.current.forEach((marker) => {
      if (marker) {
        marker.setMap(null);
      }
    });
    markerRefs.current = [];

    // Close any open info window
    if (activeInfoWindow.current) {
      activeInfoWindow.current.close();
      activeInfoWindow.current = null;
    }

    // Set the directions to display
    directionsRenderer.setDirections(directions);

    // Get the travel mode color
    const travelMode = routeInfo?.travelMode || "DRIVING";
    const primaryColor = getTravelModeColor(travelMode);
    const secondaryColor = getSecondaryColor(travelMode);
    const outlineColor = getOutlineColor(travelMode);

    // Create custom polylines for each route
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
          });
          polylineRefs.current.push(outlinePolyline);

          // For transit mode, add transfer markers on the primary route
          if (travelMode === "TRANSIT") {
            createTransferMarkers(route);
          }
        }

        // Create polyline for this route
        const polyline = new window.google.maps.Polyline({
          path: path,
          strokeColor: index === 0 ? primaryColor : secondaryColor,
          strokeWeight: index === 0 ? 6 : 4, // Increased weight for primary
          strokeOpacity: index === 0 ? 1.0 : 0.7, // Increased opacity for better visibility
          zIndex: index === 0 ? 10 : 5, // Primary route on top
          map: map,
          clickable: true, // Make polyline clickable
          cursor: "pointer", // Change cursor on hover
        });

        // Add click event listener to all polylines
        if (onRouteChange && index > 0) {
          // Only add click handlers to alternative routes
          polyline.addListener("click", () => {
            // Close any open info window when changing routes
            if (activeInfoWindow.current) {
              activeInfoWindow.current.close();
              activeInfoWindow.current = null;
            }

            handleRouteClick(index);
          });

          // Add hover effects
          polyline.addListener("mouseover", () => {
            polyline.setOptions({
              strokeColor: primaryColor, // Change to primary color on hover
              strokeOpacity: 0.8,
              strokeWeight: 5,
              zIndex: 9, // Above other alternatives but below primary
            });
          });

          polyline.addListener("mouseout", () => {
            polyline.setOptions({
              strokeColor: secondaryColor, // Back to secondary color
              strokeOpacity: 0.7,
              strokeWeight: 4,
              zIndex: 5,
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
  }, [directionsRenderer, directions, map, routeInfo, onRouteChange]);

  // Handle route click
  const handleRouteClick = (index) => {
    if (!directions || !onRouteChange) return;

    // Create a new directions object with the clicked route moved to the first position
    const newDirections = JSON.parse(JSON.stringify(directions)); // Deep clone

    // Move the clicked route to the first position
    const clickedRoute = newDirections.routes[index];
    const newRoutes = [clickedRoute, ...newDirections.routes.filter((_, i) => i !== index)];

    newDirections.routes = newRoutes;

    // Update the directions in the parent component
    onRouteChange(newDirections);
  };

  return null;
};

export default DirectionsHandler;
