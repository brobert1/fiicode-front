import React, { useState, useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { debounce } from "lodash";
import { classnames } from "@lib";
import { Button } from "@components";
import { Modal } from "react-bootstrap";
import TravelModeSelector from "@components/GoogleMaps/TravelModeSelector";

const DirectionsModal = ({ isOpen, hide, userLocation, onDirectionsFound }) => {
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [originPredictions, setOriginPredictions] = useState([]);
  const [destinationPredictions, setDestinationPredictions] = useState([]);
  const [originHighlightedIndex, setOriginHighlightedIndex] = useState(-1);
  const [destinationHighlightedIndex, setDestinationHighlightedIndex] = useState(-1);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [travelMode, setTravelMode] = useState("DRIVING");

  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);

  const places = useMapsLibrary("places");
  const routes = useMapsLibrary("routes");

  // Initialize services when libraries are loaded
  useEffect(() => {
    if (!places) return;
    setAutocompleteService(new places.AutocompleteService());
  }, [places]);

  useEffect(() => {
    if (!routes) return;
    setDirectionsService(new routes.DirectionsService());
  }, [routes]);

  // Set user location as origin by default
  useEffect(() => {
    if (userLocation && isOpen) {
      setOrigin({
        location: userLocation,
        description: "Current Location",
      });
      setOriginInput("Current Location");
    }
  }, [userLocation, isOpen]);

  // Handle visibility changes
  useEffect(() => {
    if (!isOpen) {
      setOriginPredictions([]);
      setDestinationPredictions([]);
      setOriginHighlightedIndex(-1);
      setDestinationHighlightedIndex(-1);
      setError(null);

      // Reset destination input when modal is closed
      if (destinationInput) {
        setDestinationInput("");
        setDestination(null);
      }
    }
  }, [isOpen, destinationInput]);

  const fetchPredictions = (input, setStateFn) => {
    if (!autocompleteService || !input) {
      setStateFn([]);
      return;
    }

    autocompleteService.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: "ro" },
        types: ["geocode", "establishment"],
      },
      (predictions, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
          setStateFn([]);
          return;
        }
        setStateFn(predictions.slice(0, 5));
      }
    );
  };

  const debouncedFetchOriginPredictions = debounce(
    (input) => fetchPredictions(input, setOriginPredictions),
    300
  );

  const debouncedFetchDestinationPredictions = debounce(
    (input) => fetchPredictions(input, setDestinationPredictions),
    300
  );

  const handleOriginInputChange = (e) => {
    const value = e.target.value;
    setOriginInput(value);
    setOrigin(null);
    debouncedFetchOriginPredictions(value);
  };

  const handleDestinationInputChange = (e) => {
    const value = e.target.value;
    setDestinationInput(value);
    setDestination(null);
    debouncedFetchDestinationPredictions(value);
  };

  const handleOriginSelect = (prediction) => {
    if (!places) return;

    const placesService = new places.PlacesService(document.createElement("div"));

    placesService.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["geometry", "formatted_address", "place_id", "name"],
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const selectedOrigin = {
            id: prediction.place_id,
            description: prediction.description,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          };

          setOrigin(selectedOrigin);
          setOriginInput(prediction.description);
          setOriginPredictions([]);

          // Focus destination input if it's empty
          if (!destination) {
            destinationInputRef.current?.focus();
          }
        }
      }
    );
  };

  const handleDestinationSelect = (prediction) => {
    if (!places) return;

    const placesService = new places.PlacesService(document.createElement("div"));

    placesService.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["geometry", "formatted_address", "place_id", "name"],
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const selectedDestination = {
            id: prediction.place_id,
            description: prediction.description,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          };

          setDestination(selectedDestination);
          setDestinationInput(prediction.description);
          setDestinationPredictions([]);
        }
      }
    );
  };

  const handleGetDirections = () => {
    if (!directionsService || !origin || !destination) return;

    setIsLoading(true);
    setError(null);

    const request = {
      origin: origin.location,
      destination: destination.location,
      travelMode: window.google.maps.TravelMode[travelMode],
      provideRouteAlternatives: true,
    };

    directionsService.route(request, (result, status) => {
      setIsLoading(false);

      if (status === window.google.maps.DirectionsStatus.OK) {
        onDirectionsFound(result, {
          origin: origin,
          destination: destination,
          travelMode: travelMode,
        });

        // Clear destination input after successful search
        setDestinationInput("");
        setDestination(null);

        hide();
      } else {
        setError("Could not calculate directions. Please try again.");
      }
    });
  };

  const handleSwapLocations = () => {
    if (origin && destination) {
      const tempOrigin = origin;
      const tempOriginInput = originInput;

      setOrigin(destination);
      setOriginInput(destinationInput);

      setDestination(tempOrigin);
      setDestinationInput(tempOriginInput);
    }
  };

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
          {/* Travel mode selector */}
          <TravelModeSelector selectedMode={travelMode} onChange={setTravelMode} className="mb-4" />

          <div className="relative mb-4">
            <div className="absolute left-3 top-2 text-blue-500">
              <i className="fas fa-circle text-sm"></i>
            </div>
            <input
              ref={originInputRef}
              type="text"
              value={originInput}
              onChange={handleOriginInputChange}
              placeholder="Choose starting point"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />

            {originPredictions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
                {originPredictions.map((prediction, index) => (
                  <li
                    key={prediction.place_id}
                    onClick={() => handleOriginSelect(prediction)}
                    className={classnames(
                      "px-4 py-2 cursor-pointer flex items-start",
                      index === originHighlightedIndex
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "hover:bg-gray-100"
                    )}
                  >
                    <i
                      className={classnames(
                        "fas fa-map-marker-alt mt-1 mr-2",
                        index === originHighlightedIndex ? "text-white" : "text-red-500"
                      )}
                    ></i>
                    <div>
                      <div
                        className={classnames(
                          "font-medium",
                          index === originHighlightedIndex ? "text-white" : "text-gray-800"
                        )}
                      >
                        {prediction.structured_formatting?.main_text ||
                          prediction.description.split(",")[0]}
                      </div>
                      <div
                        className={classnames(
                          "text-sm",
                          index === originHighlightedIndex ? "text-blue-100" : "text-gray-500"
                        )}
                      >
                        {prediction.structured_formatting?.secondary_text ||
                          prediction.description.split(",").slice(1).join(",")}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-center -mt-2 mb-2">
            <button
              onClick={handleSwapLocations}
              className="bg-white rounded-full w-8 h-8 shadow-md flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors border border-gray-200"
              title="Swap locations"
            >
              <i className="fas fa-exchange-alt"></i>
            </button>
          </div>

          <div className="relative mb-4">
            <div className="absolute left-3 top-2 text-red-500">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <input
              ref={destinationInputRef}
              type="text"
              value={destinationInput}
              onChange={handleDestinationInputChange}
              placeholder="Choose destination"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />

            {destinationPredictions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
                {destinationPredictions.map((prediction, index) => (
                  <li
                    key={prediction.place_id}
                    onClick={() => handleDestinationSelect(prediction)}
                    className={classnames(
                      "px-4 py-2 cursor-pointer flex items-start",
                      index === destinationHighlightedIndex
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "hover:bg-gray-100"
                    )}
                  >
                    <i
                      className={classnames(
                        "fas fa-map-marker-alt mt-1 mr-2",
                        index === destinationHighlightedIndex ? "text-white" : "text-red-500"
                      )}
                    ></i>
                    <div>
                      <div
                        className={classnames(
                          "font-medium",
                          index === destinationHighlightedIndex ? "text-white" : "text-gray-800"
                        )}
                      >
                        {prediction.structured_formatting?.main_text ||
                          prediction.description.split(",")[0]}
                      </div>
                      <div
                        className={classnames(
                          "text-sm",
                          index === destinationHighlightedIndex ? "text-blue-100" : "text-gray-500"
                        )}
                      >
                        {prediction.structured_formatting?.secondary_text ||
                          prediction.description.split(",").slice(1).join(",")}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

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
