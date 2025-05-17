import { useEffect, useState, useRef, useCallback } from "react";
import { useMap } from "@vis.gl/react-google-maps";

const DirectionsHandler = ({ directions, routeInfo, onRouteChange, onLegSelect }) => {
  const map = useMap();
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const polylineRefs = useRef([]);
  const legPolylineRefs = useRef([]);
  const outlinePolylineRefs = useRef([]);
  const markerRefs = useRef([]);
  const activeInfoWindow = useRef(null);
  const [selectedLegIndex, setSelectedLegIndex] = useState(0);

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

      // Clean up leg polylines
      legPolylineRefs.current.forEach((polyline) => {
        if (polyline) {
          window.google.maps.event.clearInstanceListeners(polyline);
          polyline.setMap(null);
        }
      });
      legPolylineRefs.current = [];

      // Clean up outline polylines
      outlinePolylineRefs.current.forEach((polyline) => {
        if (polyline) {
          polyline.setMap(null);
        }
      });
      outlinePolylineRefs.current = [];

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
      case "RIDESHARING":
        return "#9C27B0"; // Purple
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
      case "RIDESHARING":
        return "#E1BEE7"; // Lighter purple
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
      case "RIDESHARING":
        return "#6A1B9A"; // Darker purple
      default:
        return "#003380"; // Default darker blue
    }
  };

  // Get inactive color for non-selected legs
  const getInactiveColor = (travelMode) => {
    switch (travelMode) {
      case "DRIVING":
        return "#C7D8F2"; // Very light blue
      case "WALKING":
        return "#D9F2E3"; // Very light green
      case "TRANSIT":
        return "#F2D9D1"; // Very light red
      case "RIDESHARING":
        return "#E8D9EF"; // Very light purple
      default:
        return "#E5E5E5"; // Light grey
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

  // Handle leg selection
  const handleLegSelect = useCallback((legIndex) => {
    setSelectedLegIndex(legIndex);

    // Get colors for the travel mode
    const travelMode = routeInfo?.travelMode || "DRIVING";
    const primaryColor = getTravelModeColor(travelMode);
    const inactiveColor = getInactiveColor(travelMode);
    const outlineColor = getOutlineColor(travelMode);

    // Update polyline colors based on selection
    legPolylineRefs.current.forEach((polyline, index) => {
      if (!polyline) return;

      if (index === legIndex) {
        // Highlight selected leg
        polyline.setOptions({
          strokeColor: primaryColor,
          strokeWeight: 6,
          strokeOpacity: 1.0,
          zIndex: 10
        });
      } else {
        // Dim other legs
        polyline.setOptions({
          strokeColor: inactiveColor,
          strokeWeight: 4,
          strokeOpacity: 0.7,
          zIndex: 5
        });
      }
    });

    // Update outline polylines
    outlinePolylineRefs.current.forEach((polyline, index) => {
      if (!polyline) return;

      if (index === legIndex) {
        // Highlighted outline for selected leg
        polyline.setOptions({
          strokeColor: outlineColor,
          strokeOpacity: 0.7,
          zIndex: 9
        });
      } else {
        // Dim outline for other legs
        polyline.setOptions({
          strokeColor: "#999999", // Generic gray for non-selected outlines
          strokeOpacity: 0.4,
          zIndex: 4
        });
      }
    });

    // Notify parent component about leg selection
    if (onLegSelect) {
      onLegSelect(legIndex);
    }
  }, [routeInfo, onLegSelect]);

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

    legPolylineRefs.current.forEach((polyline) => {
      if (polyline) {
        window.google.maps.event.clearInstanceListeners(polyline);
        polyline.setMap(null);
      }
    });
    legPolylineRefs.current = [];

    outlinePolylineRefs.current.forEach((polyline) => {
      if (polyline) {
        polyline.setMap(null);
      }
    });
    outlinePolylineRefs.current = [];

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

    // If the travel mode is RIDESHARING, only show markers but not polylines
    if (travelMode === "RIDESHARING") {
      // Create markers for origin and destination
      if (directions.routes && directions.routes.length > 0 && directions.routes[0].legs && directions.routes[0].legs.length > 0) {
        const leg = directions.routes[0].legs[0];

        // Origin marker
        const originMarker = new window.google.maps.Marker({
          position: leg.start_location,
          map: map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4CAF50", // Green
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
          title: "Origin",
          zIndex: 20,
        });
        markerRefs.current.push(originMarker);

        // Destination marker
        const destinationMarker = new window.google.maps.Marker({
          position: leg.end_location,
          map: map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#F44336", // Red
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
          title: "Destination",
          zIndex: 20,
        });
        markerRefs.current.push(destinationMarker);
      }
      return;
    }

    const primaryColor = getTravelModeColor(travelMode);
    const secondaryColor = getSecondaryColor(travelMode);
    const outlineColor = getOutlineColor(travelMode);
    const inactiveColor = getInactiveColor(travelMode);

    // Create custom polylines for each route
    if (directions.routes && directions.routes.length > 0) {
      // Handle alternative routes
      directions.routes.forEach((route, routeIndex) => {
        // Skip the primary route for now - we'll handle it separately for segments
        if (routeIndex === 0) return;

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

        // Create polyline for this alternative route
        const polyline = new window.google.maps.Polyline({
          path: path,
          strokeColor: secondaryColor,
          strokeWeight: 4,
          strokeOpacity: 0.7,
          zIndex: 5,
          map: map,
          clickable: true,
          cursor: "pointer",
        });

        // Add click event listener to alternative routes
        if (onRouteChange) {
          polyline.addListener("click", () => {
            if (activeInfoWindow.current) {
              activeInfoWindow.current.close();
              activeInfoWindow.current = null;
            }
            handleRouteClick(routeIndex);
          });

          // Add hover effects
          polyline.addListener("mouseover", () => {
            polyline.setOptions({
              strokeColor: primaryColor,
              strokeOpacity: 0.8,
              strokeWeight: 5,
              zIndex: 9,
            });
          });

          polyline.addListener("mouseout", () => {
            polyline.setOptions({
              strokeColor: secondaryColor,
              strokeOpacity: 0.7,
              strokeWeight: 4,
              zIndex: 5,
            });
          });
        }

        polylineRefs.current.push(polyline);
      });

      // Now handle the primary route with segments
      const primaryRoute = directions.routes[0];

      // Reset leg-related arrays
      legPolylineRefs.current = [];
      outlinePolylineRefs.current = [];

      if (primaryRoute.legs && primaryRoute.legs.length > 0) {
        // Create segment polylines for each leg in the primary route
        primaryRoute.legs.forEach((leg, legIndex) => {
          const legPath = [];

          // Extract path from the leg steps
          if (leg.steps) {
            leg.steps.forEach((step) => {
              if (step.path) {
                legPath.push(...step.path);
              } else {
                legPath.push(step.start_location);
                legPath.push(step.end_location);
              }
            });
          }

          // Create outline polyline for this leg segment
          const outlinePolyline = new window.google.maps.Polyline({
            path: legPath,
            strokeColor: legIndex === selectedLegIndex ? outlineColor : "#999999",
            strokeWeight: 8,
            strokeOpacity: legIndex === selectedLegIndex ? 0.7 : 0.4,
            zIndex: legIndex === selectedLegIndex ? 9 : 4,
            map: map,
          });
          outlinePolylineRefs.current.push(outlinePolyline);

          // Create main polyline for this leg segment
          const legPolyline = new window.google.maps.Polyline({
            path: legPath,
            strokeColor: legIndex === selectedLegIndex ? primaryColor : inactiveColor,
            strokeWeight: legIndex === selectedLegIndex ? 6 : 4,
            strokeOpacity: legIndex === selectedLegIndex ? 1.0 : 0.7,
            zIndex: legIndex === selectedLegIndex ? 10 : 5,
            map: map,
            clickable: true,
            cursor: "pointer",
          });

          // Add click handler for leg selection
          legPolyline.addListener("click", () => {
            if (activeInfoWindow.current) {
              activeInfoWindow.current.close();
              activeInfoWindow.current = null;
            }
            handleLegSelect(legIndex);
          });

          // Add hover effects
          legPolyline.addListener("mouseover", () => {
            if (legIndex !== selectedLegIndex) {
              legPolyline.setOptions({
                strokeColor: primaryColor,
                strokeOpacity: 0.8,
                strokeWeight: 5,
                zIndex: 8,
              });

              // Also update the outline on hover
              if (outlinePolylineRefs.current[legIndex]) {
                outlinePolylineRefs.current[legIndex].setOptions({
                  strokeColor: outlineColor,
                  strokeOpacity: 0.5,
                  zIndex: 7
                });
              }
            }
          });

          legPolyline.addListener("mouseout", () => {
            if (legIndex !== selectedLegIndex) {
              legPolyline.setOptions({
                strokeColor: inactiveColor,
                strokeOpacity: 0.7,
                strokeWeight: 4,
                zIndex: 5,
              });

              // Reset outline on mouseout
              if (outlinePolylineRefs.current[legIndex]) {
                outlinePolylineRefs.current[legIndex].setOptions({
                  strokeColor: "#999999",
                  strokeOpacity: 0.4,
                  zIndex: 4
                });
              }
            }
          });

          legPolylineRefs.current.push(legPolyline);
        });

        // For transit mode, add transfer markers on the primary route
        if (travelMode === "TRANSIT") {
          createTransferMarkers(primaryRoute);
        }
      }

      // Fit the map to the directions
      const bounds = new window.google.maps.LatLngBounds();

      // Add origin and destination to bounds
      if (routeInfo?.origin?.location) {
        bounds.extend(routeInfo.origin.location);
      }

      if (routeInfo?.destination?.location) {
        bounds.extend(routeInfo.destination.location);
      }

      // Add waypoints to bounds if they exist
      if (routeInfo?.waypoints) {
        routeInfo.waypoints.forEach(waypoint => {
          if (waypoint && waypoint.location) {
            bounds.extend(waypoint.location);
          }
        });
      }

      // Add all steps in the route to bounds
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

      // Automatically select the first leg
      handleLegSelect(0);
    }
  }, [directionsRenderer, directions, map, routeInfo, onRouteChange, handleLegSelect]);

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

    // Reset selected leg index when changing routes
    setSelectedLegIndex(0);
  };

  return null;
};

export default DirectionsHandler;
