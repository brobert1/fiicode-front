import { useEffect, useState, useRef } from "react";
import { Map } from "@vis.gl/react-google-maps";

const SimpleRouteMap = ({ todos }) => {
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const mapRef = useRef(null);
  const [center, setCenter] = useState(
    todos.length > 0 ? todos[0].location : { lat: 45.760696, lng: 21.226788 }
  );
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (!todos.length && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);
          setZoom(14); // Zoom in when we get user location
        },
        (error) => {
          console.error("Error getting location for route map: ", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, [todos]);

  // Initialize directions service and renderer
  useEffect(() => {
    if (window.google && !directionsService) {
      setDirectionsService(new window.google.maps.DirectionsService());
      const renderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#1976D2",
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      });
      setDirectionsRenderer(renderer);
    }
  }, [directionsService]);

  // Set the map for the renderer when map is available
  useEffect(() => {
    if (directionsRenderer && mapRef.current) {
      directionsRenderer.setMap(mapRef.current);
    }

    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [directionsRenderer, mapRef.current]);

  useEffect(() => {
    if (directionsService && directionsRenderer && todos.length >= 2) {
      const origin = todos[0].location;

      const destination = todos[todos.length - 1].location;

      const waypoints = todos.slice(1, -1).map((todo) => ({
        location: new window.google.maps.LatLng(todo.location.lat, todo.location.lng),
        stopover: true,
      }));

      directionsService.route(
        {
          origin: new window.google.maps.LatLng(origin.lat, origin.lng),
          destination: new window.google.maps.LatLng(destination.lat, destination.lng),
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          } else {
            console.error(`Directions request failed: ${status}`);
          }
        }
      );
    }
  }, [directionsService, directionsRenderer, todos]);

  return (
    <div className="w-full h-full">
      <Map
        defaultCenter={center}
        zoom={zoom}
        mapId={process.env.GOOGLE_MAPS_ID}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        gestureHandling="greedy"
      />
    </div>
  );
};

export default SimpleRouteMap;
