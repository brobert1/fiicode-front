import React, { useMemo } from "react";
import Badge from "./Badge";
import { badgesData } from "@data";
import { useScroll } from "@hooks";
import ProgressBar from "react-bootstrap/ProgressBar";

const Badges = ({ xp = 1500 }) => {
  const { scrollContainerRef, showLeftButton, showRightButton, scrollLeft, scrollRight } =
    useScroll();

  const totalXpRequired = useMemo(() => {
    return badgesData.reduce((total, badge) => total + badge.xpRequired, 0);
  }, []);

  const progressPercentage = useMemo(() => {
    return Math.min(100, Math.round((xp / totalXpRequired) * 100));
  }, [xp, totalXpRequired]);

  const processedBadges = useMemo(() => {
    return badgesData.map((badge) => ({
      ...badge,
      earned: xp >= badge.xpRequired,
      date:
        xp >= badge.xpRequired
          ? badge.date ||
            new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
          : "",
    }));
  }, [xp]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-black text-2xl font-bold">Badges</h2>
        <span className="text-gray-500 text-sm">{xp} XP</span>
      </div>
      <ProgressBar now={progressPercentage} variant="primary" className="mb-1 h-2" />
      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span>Progress: {progressPercentage}%</span>
        <span>
          {xp}/{totalXpRequired} XP
        </span>
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
              key={badge.id}
              icon={badge.icon}
              name={badge.name}
              date={badge.date}
              earned={badge.earned}
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

export default Badges;
