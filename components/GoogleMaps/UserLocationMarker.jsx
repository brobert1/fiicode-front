import React, { useEffect, useState } from "react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { classnames } from "@lib";

const UserLocationMarker = ({
  position,
  accuracy = 20,
  heading = null,
  showAccuracyCircle = true,
  pulseEffect = true,
  onClick,
}) => {
  const [pulsing, setPulsing] = useState(pulseEffect);
  const [isHovered, setIsHovered] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);

  useEffect(() => {
    if (!pulseEffect) return;

    const timer = setTimeout(() => {
      setPulsing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [pulseEffect]);

  useEffect(() => {
    if (position && !isRefreshed) {
      setIsRefreshed(true);
      return;
    }

    if (position && isRefreshed) {
      setPulsing(true);
      const timer = setTimeout(() => {
        setPulsing(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [position]);

  const accuracyRadius = Math.min(Math.max(accuracy / 2, 10), 50);

  const handleMarkerClick = () => {
    if (onClick) {
      onClick();
      setPulsing(true);
      setTimeout(() => {
        setPulsing(false);
      }, 2000);
    }
  };

  return (
    <AdvancedMarker position={position} onClick={handleMarkerClick}>
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {pulsing && (
          <div className="absolute -inset-8 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-500 bg-opacity-20 animate-ping"></div>
          </div>
        )}

        {showAccuracyCircle && (
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              inset: `-${accuracyRadius}px`,
              opacity: isHovered ? 0.7 : 0.3,
              transition: "opacity 0.3s ease",
            }}
          >
            <div
              className={classnames(
                "rounded-full border-2 border-blue-400 w-full h-full",
                pulsing ? "animate-pulse" : ""
              )}
            ></div>
          </div>
        )}

        <div
          className={classnames(
            "relative transition-transform duration-300",
            isHovered ? "scale-110" : "",
            pulsing ? "zoom-in-out" : ""
          )}
          style={heading !== null ? { transform: `rotate(${heading}deg)` } : {}}
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center z-10">
            <div className="w-4 h-4 rounded-full bg-white animate-pulse"></div>

            {heading !== null && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-0 h-0 border-l-3 border-r-3 border-b-6 border-transparent border-b-white"></div>
              </div>
            )}
          </div>

          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-blue-500 shadow-md"></div>
          </div>

          {isHovered && (
            <div
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md text-xs font-medium text-gray-700 whitespace-nowrap"
              style={{ transform: heading !== null ? `rotate(-${heading}deg)` : "" }}
            >
              Your Location
              {heading !== null && ` (${Math.round(heading)}°)`}
            </div>
          )}
        </div>
      </div>
    </AdvancedMarker>
  );
};

export default UserLocationMarker;
