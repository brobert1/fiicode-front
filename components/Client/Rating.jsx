import React from "react";
import { classnames } from "@lib";

const Rating = ({ rating, reviewCount, size = "sm" }) => {
  if (!rating) return null;

  const starSizes = {
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
  };

  const starSize = starSizes[size] || starSizes.sm;

  return (
    <div className="flex items-center mt-3">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          let starIcon = "far fa-star"; // empty star

          if (rating >= star) {
            starIcon = "fas fa-star"; // full star
          } else if (rating >= star - 0.5) {
            starIcon = "fas fa-star-half-alt"; // half star
          }

          return <i key={star} className={classnames(starIcon, starSize, "text-yellow-400")}></i>;
        })}
      </div>

      {reviewCount !== undefined && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default Rating;
