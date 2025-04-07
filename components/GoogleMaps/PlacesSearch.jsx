import React from "react";
import { classnames } from "@lib";
import PredictionList from "./PredictionList";
import usePlacesSearch from "../../hooks/use-places-search";
import { Trim } from "@components";

const PlacesSearch = ({ isVisible, onPlaceSelect, hasActiveDirections }) => {
  const {
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
    removeRecentSearch,
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
            onBlur={handleInputBlur}
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

        {showRecentSearches && recentSearches.length > 0 && (
          <div
            className="absolute mt-1 w-full z-30 bg-white rounded-md shadow-lg overflow-hidden"
            ref={predictionsRef}
          >
            <ul className="max-h-60 overflow-y-auto">
              {recentSearches.map((prediction, index) => (
                <li
                  key={prediction.place_id}
                  onClick={() => handlePredictionSelect(prediction)}
                  className={classnames(
                    "px-4 py-2 cursor-pointer flex items-start justify-between transition-colors duration-150 ease-in-out",
                    index === highlightedIndex
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-start">
                    <i
                      className={classnames(
                        "fa-solid fa-clock-rotate-left mt-1 mr-2 transition-colors duration-150 ease-in-out",
                        index === highlightedIndex ? "text-white" : "text-blue-500"
                      )}
                    ></i>
                    <div>
                      <div
                        className={classnames(
                          "font-medium transition-colors duration-150 ease-in-out",
                          index === highlightedIndex ? "text-white" : "text-gray-800"
                        )}
                      >
                        {prediction.structured_formatting?.main_text ||
                          prediction.description.split(",")[0]}
                      </div>
                      <div
                        className={classnames(
                          "text-sm transition-colors duration-150 ease-in-out",
                          index === highlightedIndex ? "text-blue-100" : "text-gray-500"
                        )}
                      >
                        <Trim
                          value={prediction.structured_formatting?.secondary_text ||
                            prediction.description.split(",").slice(1).join(",")}
                          limit={30}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => removeRecentSearch(e, prediction.place_id)}
                    className={classnames(
                      "self-center text-xs p-1",
                      index === highlightedIndex
                        ? "text-white hover:text-blue-200"
                        : "text-gray-400 hover:text-red-500"
                    )}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {predictions.length > 0 && !showRecentSearches && (
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
