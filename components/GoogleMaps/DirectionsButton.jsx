import React from "react";
import { Button } from "@components";
import { classnames } from "@lib";

const DirectionsButton = ({ onClick, isActive }) => {
  return (
    <Button
      onClick={onClick}
      className={classnames(
        "flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-md hover:bg-gray-50 transition-all duration-200 border border-gray-200",
        isActive ? "text-white bg-blue-500 hover:bg-blue-600" : "text-blue-500"
      )}
      aria-label="Get directions"
      title="Get directions"
    >
      <i className="fas fa-directions text-lg"></i>
    </Button>
  );
};

export default DirectionsButton;
