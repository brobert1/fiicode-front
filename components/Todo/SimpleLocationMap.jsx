import { useEffect, useState } from "react";
import { Map } from "@vis.gl/react-google-maps";

const SimpleLocationMap = ({ initialLocation, onLocationSelect }) => {
  const [center, setCenter] = useState(initialLocation || { lat: 45.760696, lng: 21.226788 });
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);
          setZoom(16);
        },
        (error) => {
          console.error("Error getting location: ", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, [initialLocation]);

  const handleMapClick = (e) => {
    try {
      let lat, lng;

      if (e.latLng) {
        lat = e.latLng.lat();
        lng = e.latLng.lng();
      } else if (e.detail && e.detail.latLng) {
        lat =
          typeof e.detail.latLng.lat === "function" ? e.detail.latLng.lat() : e.detail.latLng.lat;
        lng =
          typeof e.detail.latLng.lng === "function" ? e.detail.latLng.lng() : e.detail.latLng.lng;
      } else if (e.center) {
        lat = e.center.lat;
        lng = e.center.lng;
      }

      if (lat !== undefined && lng !== undefined) {
        const newLocation = { lat, lng };
        if (onLocationSelect) {
          onLocationSelect(newLocation);
        }
      }
    } catch (error) {
      console.error("Error handling map click:", error, e);
    }
  };

  return (
    <div className="w-full h-full">
      <Map
        defaultCenter={center}
        zoom={zoom}
        mapId={process.env.GOOGLE_MAPS_ID}
        onClick={handleMapClick}
        disableDefaultUI={true}
        gestureHandling="greedy"
        clickableIcons={false}
      />
    </div>
  );
};

export default SimpleLocationMap;
