import { Button } from "@components";
import { useProfile } from "@hooks";
import { classnames } from "@lib";
import React from "react";

const TooltipContent = ({ placeInfo, loading, error, onGetDirections, onSetAlert }) => {
  const { me } = useProfile();
  if (loading) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (!placeInfo) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-800">{placeInfo.name}</h3>
      </div>

      {placeInfo.type && <div className="text-xs text-gray-500 -mt-1 mb-1">{placeInfo.type}</div>}

      <p className="text-sm text-gray-600 mb-2">{placeInfo.address}</p>

      <div className="flex gap-2 mt-2">
        {me?.role === "client" && (
          <Button
            onClick={onGetDirections}
            className="text-xs w-1/2 justify-center bg-blue-500 text-white px-2 py-1 rounded flex items-center hover:bg-blue-600 transition-colors"
          >
            <i className="fas fa-directions mr-1"></i> Directions
          </Button>
        )}
        <Button
          onClick={() => onSetAlert && onSetAlert(placeInfo)}
          className={classnames(
            "text-xs w-full justify-center bg-yellow-500 text-white px-2 py-1 rounded flex items-center hover:bg-yellow-600 transition-colors",
            me?.role === "client" && "w-1/2"
          )}
        >
          <i className="fas fa-bell mr-1"></i> Add Alert
        </Button>
      </div>
    </>
  );
};

export default TooltipContent;
