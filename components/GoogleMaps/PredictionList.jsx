import React from "react";
import { classnames } from "@lib";

const PredictionList = ({ predictions, highlightedIndex, onSelect }) => {
  if (predictions.length === 0) return null;

  return (
    <ul className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto transition-all duration-300 ease-in-out animate-slideDown">
      {predictions.map((prediction, index) => (
        <li
          key={prediction.place_id}
          onClick={() => onSelect(prediction)}
          className={classnames(
            "px-4 py-2 cursor-pointer flex items-start transition-colors duration-150 ease-in-out",
            index === highlightedIndex
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              : "hover:bg-gray-100"
          )}
        >
          <i
            className={classnames(
              "fas fa-map-marker-alt mt-1 mr-2 transition-colors duration-150 ease-in-out",
              index === highlightedIndex ? "text-white" : "text-red-500"
            )}
          ></i>
          <div>
            <div
              className={classnames(
                "font-medium transition-colors duration-150 ease-in-out",
                index === highlightedIndex ? "text-white" : "text-gray-800"
              )}
            >
              {prediction.structured_formatting?.main_text || prediction.description.split(",")[0]}
            </div>
            <div
              className={classnames(
                "text-sm transition-colors duration-150 ease-in-out",
                index === highlightedIndex ? "text-blue-100" : "text-gray-500"
              )}
            >
              {prediction.structured_formatting?.secondary_text ||
                prediction.description.split(",").slice(1).join(",")}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PredictionList;
