import React from "react";
import { classnames } from "@lib";
import { Button } from "@components";
import { Modal } from "react-bootstrap";
import { useDirectionsModal } from "@hooks";
import { LocationInput } from "@components/GoogleMaps";

const DirectionsModal = ({ isOpen, hide, userLocation, onDirectionsFound, initialDestination }) => {
  const {
    originInput,
    destinationInput,
    originPredictions,
    destinationPredictions,
    originHighlightedIndex,
    destinationHighlightedIndex,
    origin,
    destination,
    isLoading,
    error,
    originInputRef,
    destinationInputRef,
    handleOriginInputChange,
    handleDestinationInputChange,
    handleOriginSelect,
    handleDestinationSelect,
    handleGetDirections,
    handleSwapLocations,
  } = useDirectionsModal({
    isOpen,
    userLocation,
    onDirectionsFound,
    initialDestination,
    hide,
  });

  return (
    <Modal show={isOpen} onHide={hide} backdrop="static" keyboard={false} centered>
      <Modal.Header className="flex items-center w-full justify-between">
        <Modal.Title>
          <h3 className="font-heading first-letter:uppercase text-base font-semibold">
            Get Directions
          </h3>
        </Modal.Title>
        <Button className="-mr-2 flex h-8 w-8 items-center justify-center p-2" onClick={hide}>
          <i className="fas fa-times"></i>
        </Button>
      </Modal.Header>

      <Modal.Body>
        <div className="p-2">
          <LocationInput
            value={originInput}
            onChange={handleOriginInputChange}
            placeholder="Choose starting point"
            icon="fa-circle"
            iconColor="text-blue-500"
            predictions={originPredictions}
            highlightedIndex={originHighlightedIndex}
            onSelect={handleOriginSelect}
            inputRef={originInputRef}
          />

          <div className="flex justify-center -mt-2 mb-2">
            <button
              onClick={handleSwapLocations}
              className="bg-white rounded-full w-8 h-8 shadow-md flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors border border-gray-200 rotate-90"
              title="Swap locations"
            >
              <i className="fas fa-exchange-alt"></i>
            </button>
          </div>

          <LocationInput
            value={destinationInput}
            onChange={handleDestinationInputChange}
            placeholder="Choose destination"
            icon="fa-map-marker-alt"
            iconColor="text-red-500"
            predictions={destinationPredictions}
            highlightedIndex={destinationHighlightedIndex}
            onSelect={handleDestinationSelect}
            inputRef={destinationInputRef}
          />

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
          )}

          <Button
            onClick={handleGetDirections}
            disabled={!origin || !destination || isLoading}
            className={classnames(
              "w-full py-2 px-4 rounded-lg font-medium transition-all",
              !origin || !destination || isLoading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-circle-notch fa-spin mr-2"></i>
                Calculating...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <i className="fas fa-directions mr-2"></i>
                Get Directions
              </span>
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DirectionsModal;
