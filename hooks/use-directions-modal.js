import { useState, useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { debounce } from "lodash";

/**
 * Custom hook to manage directions modal state and functionality
 *
 * @param {Object} options - Options for the hook
 * @param {boolean} options.isOpen - Whether the modal is open
 * @param {Object} options.userLocation - The user's current location
 * @param {Function} options.onDirectionsFound - Callback when directions are found
 * @param {Object} options.initialDestination - Initial destination if provided
 * @param {Function} options.hide - Function to hide the modal
 * @returns {Object} State and handlers for the directions modal
 */
const useDirectionsModal = ({ isOpen, userLocation, onDirectionsFound, initialDestination, hide }) => {
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
  // Default to driving mode
  const travelMode = "DRIVING";

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

  // Set initial destination if provided
  useEffect(() => {
    if (initialDestination && isOpen) {
      setDestination({
        id: initialDestination.id,
        location: initialDestination.location,
        description: initialDestination.name || initialDestination.address
      });
      setDestinationInput(initialDestination.name || initialDestination.address);

      // If we have both origin and destination, we can automatically get directions
      if (origin) {
        // Use a small timeout to ensure the UI has updated
        setTimeout(() => {
          handleGetDirections();
        }, 100);
      }
    }
  }, [initialDestination, isOpen, origin]);

  // Handle visibility changes
  useEffect(() => {
    if (!isOpen) {
      setOriginPredictions([]);
      setDestinationPredictions([]);
      setOriginHighlightedIndex(-1);
      setDestinationHighlightedIndex(-1);
      setError(null);

      // Reset destination input when modal is closed
      if (destinationInput && !initialDestination) {
        setDestinationInput("");
        setDestination(null);
      }
    }
  }, [isOpen, destinationInput, initialDestination]);

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

        // Hide the modal after successful directions retrieval
        if (hide) {
          hide();
        }
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

  return {
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
    handleSwapLocations
  };
};

export default useDirectionsModal;
