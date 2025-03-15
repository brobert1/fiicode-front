import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "@components";
import { CustomRouteForm } from "@components/Forms";

const CustomRouteModal = ({ isOpen, hide, routePath, routeType, endpoints, onSave }) => {
  const [routeData, setRouteData] = useState(null);

  // Calculate estimated duration based on travel mode and distance
  const calculateEstimatedDuration = (distanceMeters, mode) => {
    // Only WALKING and DRIVING are supported for custom routes
    let speedMetersPerSecond;
    switch (mode) {
      case 'WALKING':
        // Average walking speed: ~5 km/h = ~1.4 m/s
        speedMetersPerSecond = 1.4;
        break;
      case 'DRIVING':
      default:
        // Average driving speed: ~50 km/h = ~13.9 m/s
        speedMetersPerSecond = 13.9;
        break;
    }

    // Calculate duration in seconds
    return Math.round(distanceMeters / speedMetersPerSecond);
  };

  // Calculate distance between points in meters
  const calculatePathDistance = (path) => {
    if (!path || path.length < 2 || !window.google?.maps?.geometry?.spherical) return 0;

    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const p1 = new window.google.maps.LatLng(path[i].lat, path[i].lng);
      const p2 = new window.google.maps.LatLng(path[i + 1].lat, path[i + 1].lng);
      totalDistance += window.google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
    }
    return totalDistance;
  };

  // Update route data when props change
  useEffect(() => {
    if (routePath && routePath.length >= 2) {
      const distance = calculatePathDistance(routePath);

      // Ensure travel mode is either WALKING or DRIVING
      let travelMode = endpoints?.travelMode || routeType;
      if (travelMode !== 'WALKING') {
        travelMode = 'DRIVING';
      }

      const duration = calculateEstimatedDuration(distance, travelMode);

      setRouteData({
        routePath,
        routeType: travelMode,
        endpoints: {
          ...endpoints,
          travelMode: travelMode
        },
        distance,
        duration
      });
    }
  }, [routePath, routeType, endpoints]);

  const handleSubmit = (formData) => {
    if (onSave) {
      // Ensure travel mode is either WALKING or DRIVING
      const updatedFormData = {
        ...formData,
        travelMode: formData.travelMode === 'WALKING' ? 'WALKING' : 'DRIVING'
      };
      onSave(updatedFormData);
    }
    hide();
  };

  const handleContinueDrawing = () => {
    hide();
  };

  if (!routeData) return null;

  return (
    <Modal show={isOpen} onHide={hide} backdrop="static" keyboard={false} centered>
      <Modal.Header className="flex items-center w-full justify-between">
        <Modal.Title>
          <h3 className="font-heading first-letter:uppercase text-base font-semibold">
            Custom Route Created
          </h3>
        </Modal.Title>
        <div className="flex items-center">
          <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
            Custom Route
          </div>
          <Button className="-mr-2 flex h-8 w-8 items-center justify-center p-2" onClick={hide}>
            <i className="fas fa-times"></i>
          </Button>
        </div>
      </Modal.Header>

      <Modal.Body>
        <CustomRouteForm
          onSubmit={handleSubmit}
          routeData={routeData}
          handleContinueDrawing={handleContinueDrawing}
        />
      </Modal.Body>
    </Modal>
  );
};

export default CustomRouteModal;
