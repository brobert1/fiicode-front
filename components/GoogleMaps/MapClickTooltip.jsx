import React, { useState, useCallback } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { usePlaceInfo } from "@hooks";
import { TooltipContent, MarkerIcon } from ".";

const MapClickTooltip = ({ position, onClose, onGetDirections }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const { placeInfo, loading, error } = usePlaceInfo(position);

  const handleGetDirections = useCallback(
    (e) => {
      e.stopPropagation();

      if (onGetDirections && placeInfo) {
        onGetDirections(placeInfo);
      }

      setIsInfoOpen(false);
      if (onClose) {
        onClose();
      }
    },
    [onGetDirections, placeInfo, onClose]
  );

  const handleCloseInfo = useCallback(() => {
    setIsInfoOpen(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <AdvancedMarker position={position}>
      <MarkerIcon />
      {isInfoOpen && (
        <InfoWindow position={position} onCloseClick={handleCloseInfo}>
          <div className="p-2 max-w-xs">
            <TooltipContent
              placeInfo={placeInfo}
              loading={loading}
              error={error}
              onClose={handleCloseInfo}
              onGetDirections={handleGetDirections}
            />
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default MapClickTooltip;
