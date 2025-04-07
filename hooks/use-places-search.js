import { useState, useRef, useEffect, useCallback } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { debounce } from "lodash";
import useProfile from "./use-profile";

/**
 * Custom hook for handling Google Places search functionality
 *
 * @param {Object} options Configuration options
 * @param {boolean} options.isVisible Flag indicating if the search component is visible
 * @param {boolean} options.hasActiveDirections Flag indicating if directions are active
 * @param {Function} options.onPlaceSelect Callback function when a place is selected
 * @returns {Object} Search state and handlers
 */
const usePlacesSearch = ({ isVisible, hasActiveDirections, onPlaceSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isActive, setIsActive] = useState(false);
  const [hasSelectedPlace, setHasSelectedPlace] = useState(false);
  const [prevHasActiveDirections, setPrevHasActiveDirections] = useState(hasActiveDirections);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const inputRef = useRef(null);
  const predictionsRef = useRef(null);
  const places = useMapsLibrary("places");

  // Get current user ID for user-specific storage
  const { me } = useProfile();
  const userId = me?.me || "guest";
  const storageKey = `recentSearches_${userId}`;

  // Load recent searches from localStorage
  useEffect(() => {
    const storedSearches = localStorage.getItem(storageKey);
    if (storedSearches) {
      try {
        setRecentSearches(JSON.parse(storedSearches));
      } catch (e) {
        console.error("Error parsing stored searches:", e);
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  // Add click outside handler to hide predictions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        predictionsRef.current &&
        !predictionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowRecentSearches(false);
        setPredictions([]);
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initialize Google Maps services
  useEffect(() => {
    if (!places) return;
    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(document.createElement("div")));
  }, [places]);

  // Reset predictions when visibility changes
  useEffect(() => {
    if (!isVisible) {
      setPredictions([]);
      setHighlightedIndex(-1);
      setShowRecentSearches(false);
    }
  }, [isVisible]);

  // Handle transitions between directions states
  useEffect(() => {
    if (prevHasActiveDirections && !hasActiveDirections) {
      setIsTransitioning(true);
      setInputValue("");
      setPredictions([]);
      setShowRecentSearches(false);
      setHasSelectedPlace(false);
      onPlaceSelect(null);

      if (inputRef.current) {
        inputRef.current.blur();
      }

      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }

    setPrevHasActiveDirections(hasActiveDirections);
  }, [hasActiveDirections, prevHasActiveDirections, onPlaceSelect]);

  // Save place to recent searches
  const saveToRecentSearches = (place) => {
    const newPlace = {
      place_id: place.id,
      description: place.name + ", " + place.address,
      structured_formatting: {
        main_text: place.name,
        secondary_text: place.address,
      },
    };

    setRecentSearches((prevSearches) => {
      // Remove this place if it already exists
      const filteredSearches = prevSearches.filter((item) => item.place_id !== newPlace.place_id);

      // Add new place at the beginning
      const updatedSearches = [newPlace, ...filteredSearches].slice(0, 3);

      // Save to localStorage with user-specific key
      localStorage.setItem(storageKey, JSON.stringify(updatedSearches));

      return updatedSearches;
    });
  };

  // Clear all recent searches
  const clearRecentSearches = (e) => {
    if (e) e.stopPropagation();
    localStorage.removeItem(storageKey);
    setRecentSearches([]);
    setShowRecentSearches(false);
  };

  // Remove a specific recent search
  const removeRecentSearch = (e, placeId) => {
    e.stopPropagation();

    setRecentSearches((prevSearches) => {
      const updatedSearches = prevSearches.filter((item) => item.place_id !== placeId);

      if (updatedSearches.length === 0) {
        localStorage.removeItem(storageKey);
        setShowRecentSearches(false);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(updatedSearches));
      }

      return updatedSearches;
    });
  };

  // Clear search handler
  const clearSearch = useCallback(() => {
    setInputValue("");
    setPredictions([]);
    setShowRecentSearches(false);
    setHasSelectedPlace(false);
    onPlaceSelect(null);

    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, [onPlaceSelect]);

  // Input focus handler
  const handleInputFocus = () => {
    setIsActive(true);
    if (inputValue === "" && recentSearches.length > 0) {
      setShowRecentSearches(true);
    }
  };

  // Input blur handler
  const handleInputBlur = (e) => {
    // Don't hide if clicking on predictions or recent searches
    if (predictionsRef.current && predictionsRef.current.contains(e.relatedTarget)) {
      return;
    }

    // Hide after a short delay to allow clicking predictions
    setTimeout(() => {
      if (!document.activeElement || document.activeElement !== inputRef.current) {
        setIsActive(false);
      }
    }, 150);
  };

  // Fetch predictions from Places API
  const fetchPredictions = (input) => {
    if (!autocompleteService || !input) {
      setPredictions([]);
      setHighlightedIndex(-1);
      setShowRecentSearches(input === "" && recentSearches.length > 0);
      return;
    }

    setShowRecentSearches(false);

    const options = {
      input,
      componentRestrictions: { country: "ro" }, // May change
      types: ["establishment", "geocode"],
    };

    autocompleteService.getPlacePredictions(options, (results) => {
      setPredictions(results || []);
      setHighlightedIndex(-1);
    });
  };

  const debouncedFetchPredictions = debounce(fetchPredictions, 300);

  // Input change handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "" && hasSelectedPlace) {
      setHasSelectedPlace(false);
      onPlaceSelect(null);
    } else {
      debouncedFetchPredictions(value);
    }
  };

  // Clear button click handler
  const handleClearClick = (e) => {
    e.stopPropagation();
    clearSearch();
  };

  // Prediction selection handler
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
          "price_level",
        ],
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const placeData = {
            id: prediction.place_id,
            name: place.name,
            address: place.formatted_address,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
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
            phone: place.formatted_phone_number || place.international_phone_number,
            website: place.website,
            googleMapsUrl: place.url,
            openingHours: place.opening_hours
              ? {
                  isOpen: place.opening_hours.isOpen(),
                  weekdayText: place.opening_hours.weekday_text,
                }
              : null,
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
            photos: place.photos
              ? place.photos
                  .map((photo) => ({
                    url: photo.getUrl({ maxWidth: 800, maxHeight: 600 }),
                    attribution: photo.html_attributions,
                  }))
                  .slice(0, 10)
              : [], // Increased to 10 photos with higher resolution
            types: place.types,
            priceLevel: place.price_level,
          };

          // Save to recent searches
          saveToRecentSearches(placeData);

          onPlaceSelect(placeData);

          setInputValue(prediction.description);
          setPredictions([]);
          setShowRecentSearches(false);
          setHasSelectedPlace(true);

          if (inputRef.current) {
            inputRef.current.blur();
          }
        }
      }
    );
  };

  // Keyboard navigation handler
  const handleKeyDown = (e) => {
    const list = showRecentSearches ? recentSearches : predictions;

    if (!list.length) {
      if (e.key === "Escape") {
        clearSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        setHighlightedIndex((prevIndex) => Math.min(prevIndex + 1, list.length - 1));
        break;

      case "ArrowUp":
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        break;

      case "Enter":
        if (highlightedIndex !== -1) {
          handlePredictionSelect(list[highlightedIndex]);
        }
        break;

      case "Escape":
        setPredictions([]);
        setShowRecentSearches(false);
        clearSearch();
        break;

      default:
        break;
    }
  };

  return {
    inputValue,
    inputRef,
    predictions,
    recentSearches,
    showRecentSearches,
    predictionsRef,
    highlightedIndex,
    isActive,
    hasSelectedPlace,
    isTransitioning,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleKeyDown,
    handlePredictionSelect,
    handleClearClick,
    clearRecentSearches,
    removeRecentSearch,
  };
};

export default usePlacesSearch;
