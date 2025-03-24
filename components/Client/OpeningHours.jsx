import React, { useState } from "react";
import { classnames } from "@lib";
import { useOpeningHours } from "../../hooks/use-opening-hours";

const OpeningHours = ({ openingHours }) => {
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const { isOpen } = useOpeningHours(openingHours);

  const toggleSchedule = () => {
    setShowFullSchedule(!showFullSchedule);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center">
          {isOpen ? (
            <span className="text-green-600 flex items-center">
              <i className="fas fa-clock mr-2"></i>
              Open now
            </span>
          ) : (
            <span className="text-red-600 flex items-center">
              <i className="fas fa-clock mr-2"></i>
              Closed now
            </span>
          )}
        </h3>

        {openingHours?.weekdayText && openingHours?.weekdayText?.length > 0 && (
          <button onClick={toggleSchedule} className="text-blue-600 text-sm hover:text-blue-800">
            {showFullSchedule ? "Hide hours" : "Show hours"}
          </button>
        )}
      </div>

      {showFullSchedule && openingHours?.weekdayText && (
        <div
          className={classnames(
            "mt-2 text-sm text-gray-600 border-t border-gray-200 pt-2",
            "transition-all duration-300 ease-in-out animate-slideDown overflow-hidden"
          )}
        >
          {openingHours.weekdayText.map((day, index) => {
            try {
              // Split each day into its name and hours.
              const parts = day.split(": ");
              const dayName = parts[0];
              const hours = parts.length > 1 ? parts[1] : "Hours not available";
              const now = new Date();
              const dayMapping = {
                0: 6, // Sunday
                1: 0, // Monday
                2: 1, // Tuesday
                3: 2, // Wednesday
                4: 3, // Thursday
                5: 4, // Friday
                6: 5, // Saturday
              };
              const isToday = index === dayMapping[now.getDay()];

              return (
                <div
                  key={index}
                  className={classnames("flex justify-between py-1", isToday && "font-semibold")}
                >
                  <span className={isToday ? "text-blue-600" : ""}>{dayName}</span>
                  <span>{hours}</span>
                </div>
              );
            } catch (error) {
              console.error("Error rendering day:", error, day);
              return (
                <div key={index} className="py-1 text-red-500">
                  Error displaying hours
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default OpeningHours;
