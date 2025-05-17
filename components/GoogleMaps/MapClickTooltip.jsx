import React, { useState, useCallback } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { usePlaceInfo, useDisclosure, useFavoriteDirections } from "@hooks";
import { TooltipContent, MarkerIcon } from ".";
import { AlertModal } from "@components/Modals";
import PollutionInfoWindow from "./InfoWindows/PollutionInfoWindow";

const MapClickTooltip = ({ position, onClose, onGetDirections, airQualityData }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Ensure position is a valid LatLng object
  const validPosition = position && typeof position.lat === 'number' && typeof position.lng === 'number'
    ? position
    : null;

  const { placeInfo, loading, error } = usePlaceInfo(validPosition);

  // Use the useDisclosure hook to manage the alert modal state
  const alertModal = useDisclosure(false);

  // Use our custom hook for directions
  const { handleFavoriteDirections } = useFavoriteDirections({
    onGetDirections,
    onMenuClose: () => {
      setIsInfoOpen(false);
      if (onClose) {
        onClose();
      }
    }
  });

  const handleGetDirections = useCallback(
    (e) => {
      e.stopPropagation();

      if (placeInfo) {
        // Our hook now handles different place formats
        handleFavoriteDirections({
          id: placeInfo.id,
          name: placeInfo.name,
          address: placeInfo.address,
          lat: validPosition.lat,
          lng: validPosition.lng
        });
      }
    },
    [placeInfo, validPosition, handleFavoriteDirections]
  );

  const handleSetAlert = useCallback(
    (place) => {
      if (!validPosition) return;

      // Ensure we have the complete location data including coordinates
      const locationData = {
        ...place,
        latitude: validPosition.lat,
        longitude: validPosition.lng,
        lat: validPosition.lat,
        lng: validPosition.lng,
      };

      setSelectedPlace(locationData);
      alertModal.show();
    },
    [validPosition, alertModal]
  );

  const handleCloseInfo = useCallback(() => {
    setIsInfoOpen(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Handle alert form completion
  const handleAlertComplete = useCallback(() => {
    // Close the alert modal
    alertModal.hide();

    // Close the tooltip
    setIsInfoOpen(false);

    // Call the parent's onClose if provided
    if (onClose) {
      onClose();
    }
  }, [alertModal, onClose]);

  // If position is not valid, don't render anything
  if (!validPosition) {
    return null;
  }

  return (
    <>
      <AdvancedMarker position={validPosition}>
        <MarkerIcon />
        {isInfoOpen && (
          <InfoWindow position={validPosition} onCloseClick={handleCloseInfo}>
            <div className="p-2 max-w-xs">
              <TooltipContent
                placeInfo={placeInfo}
                loading={loading}
                error={error}
                onGetDirections={handleGetDirections}
                onSetAlert={handleSetAlert}
              />

              {airQualityData && (
                <div className="mt-4 border-t pt-3">
                  <PollutionInfoWindow data={airQualityData} />
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </AdvancedMarker>

      {alertModal.isOpen && (
        <AlertModal
          isOpen={alertModal.isOpen}
          hide={alertModal.hide}
          location={selectedPlace}
          onComplete={handleAlertComplete}
        />
      )}
    </>
  );
};

export default MapClickTooltip;
