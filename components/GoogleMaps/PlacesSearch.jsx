import React, { useState, useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { debounce } from "lodash";
import { classnames } from "@lib";
import PredictionList from "./PredictionList";

const PlacesSearch = ({ isVisible, onClose, onPlaceSelect, hasActiveDirections }) => {
  const [inputValue, setInputValue] = useState("");
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isActive, setIsActive] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const inputRef = useRef(null);
  const predictionsRef = useRef(null);
  const places = useMapsLibrary("places");

  // Initialize services when Places library is loaded
  useEffect(() => {
    if (!places) return;
    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(document.createElement("div")));
  }, [places]);

  // Handle visibility changes - modified to only clear results but keep active
  useEffect(() => {
    if (!isVisible) {
      setPredictions([]);
      setHighlightedIndex(-1);
    }
  }, [isVisible]);

  const handleInputFocus = () => {
    setIsActive(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const fetchPredictions = (input) => {
    if (!autocompleteService || !input) {
      setPredictions([]);
      setHighlightedIndex(-1);
      return;
    }

    const options = {
      input,
      componentRestrictions: { country: "ro" }, //may change
      types: ["establishment", "geocode"],
    };

    autocompleteService.getPlacePredictions(options, (results) => {
      setPredictions(results || []);
      setHighlightedIndex(-1);
    });
  };

  const debouncedFetchPredictions = debounce(fetchPredictions, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedFetchPredictions(value);
  };

  const handlePredictionSelect = (prediction) => {
    if (!placesService) return;

    placesService.getDetails(
      {
        placeId: prediction.place_id,
        fields: [
          "name",
          "geometry",
          "formatted_address",
          "place_id",
          "formatted_phone_number",
          "international_phone_number",
          "website",
          "url",
          "opening_hours",
          "rating",
          "user_ratings_total",
          "photos",
          "types",
          "price_level"
        ],
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          onPlaceSelect({
            id: prediction.place_id,
            name: place.name,
            address: place.formatted_address,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
            // Include viewport if available for better map fitting
            viewport: place.geometry.viewport
              ? {
                  northeast: {
                    lat: place.geometry.viewport.getNorthEast().lat(),
                    lng: place.geometry.viewport.getNorthEast().lng(),
                  },
                  southwest: {
                    lat: place.geometry.viewport.getSouthWest().lat(),
                    lng: place.geometry.viewport.getSouthWest().lng(),
                  },
                }
              : null,
            // Add additional place details
            phone: place.formatted_phone_number || place.international_phone_number,
            website: place.website,
            googleMapsUrl: place.url,
            openingHours: place.opening_hours ? {
              isOpen: place.opening_hours.isOpen(),
              weekdayText: place.opening_hours.weekday_text
            } : null,
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
            photos: place.photos ? place.photos.map(photo => ({
              url: photo.getUrl({ maxWidth: 400, maxHeight: 300 }),
              attribution: photo.html_attributions
            })).slice(0, 3) : [], // Limit to 3 photos
            types: place.types,
            priceLevel: place.price_level
          });

          // Clear input and predictions
          setInputValue(prediction.description);
          setPredictions([]);

          // Close search after selection
          setTimeout(() => {
            handleClose();
          }, 300);
        }
      }
    );
  };

  const handleKeyDown = (e) => {
    if (!predictions.length) {
      if (e.key === "Escape") {
        handleClose();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        setHighlightedIndex((prevIndex) => Math.min(prevIndex + 1, predictions.length - 1));
        break;

      case "ArrowUp":
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        break;

      case "Enter":
        if (highlightedIndex !== -1) {
          handlePredictionSelect(predictions[highlightedIndex]);
        }
        break;

      case "Escape":
        setPredictions([]);
        handleClose();
        break;

      default:
        break;
    }
  };

  return (
    <div
      className={classnames(
        "absolute left-0 right-0 z-20 px-4",
        hasActiveDirections ? "top-[calc(4rem+1px)]" : "top-4",
        isClosing ? "animate-fadeOut" : "animate-fadeIn"
      )}
    >
      <div className="relative max-w-md mx-auto">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onClick={handleInputFocus}
            placeholder="Search for a place..."
            className={classnames(
              "w-full py-3 pl-10 pr-3 rounded-full border border-gray-300 shadow-md",
              isActive
                ? "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                : "outline-none"
            )}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className={classnames("fas fa-search text-gray-400")}></i>
          </div>
        </div>

        {predictions.length > 0 && (
          <div className="absolute mt-1 w-full z-30" ref={predictionsRef}>
            <PredictionList
              predictions={predictions}
              highlightedIndex={highlightedIndex}
              onSelect={handlePredictionSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacesSearch;
