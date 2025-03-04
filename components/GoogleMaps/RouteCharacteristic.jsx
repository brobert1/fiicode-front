import React from "react";
import { classnames } from "@lib";

const RouteCharacteristic = ({ type, label }) => {
  
  // Define colors and icons based on route type
  const getTypeStyles = (type) => {
    switch (type) {
      case "fastest":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          icon: "fa-bolt",
        };
      case "shortest":
        return {
          bgColor: "bg-purple-100",
          textColor: "text-purple-700",
          icon: "fa-compress-alt",
        };
      case "eco":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          icon: "fa-leaf",
        };
      case "scenic":
        return {
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-700",
          icon: "fa-mountain",
        };
      case "optimal":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          icon: "fa-star",
        };
      case "simplest":
        return {
          bgColor: "bg-teal-100",
          textColor: "text-teal-700",
          icon: "fa-check",
        };
      case "convenient":
        return {
          bgColor: "bg-cyan-100",
          textColor: "text-cyan-700",
          icon: "fa-subway",
        };
      case "recommended":
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          icon: "fa-thumbs-up",
        };
    }
  };

  const styles = getTypeStyles(type);

  return (
    <div
      className={classnames(
        "inline-flex items-center px-2 py-1 rounded-full text-xs",
        styles.bgColor,
        styles.textColor
      )}
    >
      <i className={classnames("fas", styles.icon, "mr-1")}></i>
      {label}
    </div>
  );
};

export default RouteCharacteristic;
