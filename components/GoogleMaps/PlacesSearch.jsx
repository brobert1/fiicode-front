import React from "react";
import { classnames } from "@lib";
import PredictionList from "./PredictionList";
import usePlacesSearch from "../../hooks/use-places-search";

const PlacesSearch = ({ isVisible, onPlaceSelect, hasActiveDirections }) => {
  const {
    inputValue,
    inputRef,
    predictions,
    predictionsRef,
    highlightedIndex,
    isActive,
    hasSelectedPlace,
    isTransitioning,
    handleInputChange,
    handleInputFocus,
    handleKeyDown,
    handlePredictionSelect,
    handleClearClick,
  } = usePlacesSearch({ isVisible, hasActiveDirections, onPlaceSelect });

  return (
    <div
      className={classnames(
        "absolute left-0 right-0 z-20 px-4",
        hasActiveDirections ? "top-[calc(4rem+1px)]" : "top-4",
        isTransitioning ? "pointer-events-none" : "",
        "transition-all duration-300 ease-in-out"
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
              "transition-all duration-300 ease-in-out",
              isActive
                ? "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                : "outline-none"
            )}
          />
          <div
            className={classnames(
              "absolute inset-y-0 left-0 pl-4 flex items-center",
              hasSelectedPlace ? "cursor-pointer" : "pointer-events-none",
              "transition-all duration-200 ease-in-out"
            )}
            onClick={hasSelectedPlace ? handleClearClick : undefined}
          >
            <i
              className={classnames(
                "fas",
                hasSelectedPlace
                  ? "fa-times text-gray-600 transform transition-transform duration-200 hover:scale-125"
                  : "fa-search text-gray-400",
                "transition-all duration-200 ease-in-out"
              )}
            ></i>
          </div>
        </div>

        {predictions.length > 0 && (
          <div
            className="absolute mt-1 w-full z-30 transition-opacity duration-300 ease-in-out"
            ref={predictionsRef}
          >
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
