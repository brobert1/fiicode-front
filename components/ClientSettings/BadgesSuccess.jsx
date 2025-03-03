import { useScroll } from "@hooks";
import React, { useMemo } from "react";
import { ProgressBar } from "react-bootstrap";
import Badge from "./Badge";

const BadgesSuccess = ({ data, xp }) => {
  const { scrollContainerRef, showLeftButton, showRightButton, scrollLeft, scrollRight } =
    useScroll();

  const progressPercentage = useMemo(() => {
    return Math.min(100, Math.round((xp / (9000 || 1)) * 100));
  }, [xp]);

  const processedBadges = useMemo(() => {
    if (!data || !data.length) return [];
    return data.map((badge) => {
      return {
        ...badge,
        earned: xp >= badge.xpRequired,
      };
    });
  }, [data, xp]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-black text-2xl font-bold">Badges</h2>
        <span className="text-gray-500 text-sm">{xp} XP</span>
      </div>
      <ProgressBar now={progressPercentage} variant="primary" className="mb-1 h-2" />
      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span>Progress: {progressPercentage}%</span>
        <span>{xp}/9000 XP</span>
      </div>
      <div className="relative">
        {showLeftButton && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-opacity"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <div ref={scrollContainerRef} className="flex overflow-x-auto py-4 gap-4 hide-scrollbar">
          {processedBadges.map((badge) => (
            <Badge
              key={badge._id || badge.id}
              image={badge.image}
              name={badge.name}
              earned={badge.earned}
              description={badge.description}
            />
          ))}
        </div>
        {showRightButton && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-opacity"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default BadgesSuccess;
