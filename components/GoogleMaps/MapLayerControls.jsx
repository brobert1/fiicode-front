import { Button } from "@components";
import { classnames } from "@lib";
import React, { useEffect, useState, useRef } from "react";

const MapLayerControls = ({ layers, toggleLayer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-100" ref={menuRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white h-12 w-12 p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
        title="Map layers"
      >
        <i className="fas fa-layer-group text-primary"></i>
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden w-48 transition-all duration-200 origin-top-right">
          <div className="p-2 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">Map Layers</h3>
          </div>
          <div className="p-3">
            <div className="flex flex-col gap-3">
              <Button
                className={classnames(
                  "flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  layers.traffic
                    ? "bg-secondary text-white hover:bg-secondary"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
                onClick={() => toggleLayer("traffic")}
                title={layers.traffic ? "Hide traffic layer" : "Show traffic layer"}
              >
                <span className="flex items-center">
                  <i
                    className={classnames(
                      "fas fa-traffic-light mr-2",
                      layers.traffic ? "text-white" : "text-secondary"
                    )}
                  ></i>
                  Traffic
                </span>
                <i
                  className={classnames(
                    "fas",
                    layers.traffic ? "fa-toggle-on" : "fa-toggle-off",
                    "ml-2"
                  )}
                ></i>
              </Button>
              <Button
                className={classnames(
                  "flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  layers.transit
                    ? "bg-secondary text-white hover:bg-secondary"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
                onClick={() => toggleLayer("transit")}
                title={layers.transit ? "Hide transit layer" : "Show transit layer"}
              >
                <span className="flex items-center">
                  <i
                    className={classnames(
                      "fas fa-subway mr-2",
                      layers.transit ? "text-white" : "text-secondary"
                    )}
                  ></i>
                  Transit
                </span>
                <i
                  className={classnames(
                    "fas",
                    layers.transit ? "fa-toggle-on" : "fa-toggle-off",
                    "ml-2"
                  )}
                ></i>
              </Button>
              <Button
                className={classnames(
                  "flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  layers.satellite
                    ? "bg-secondary text-white hover:bg-secondary"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
                onClick={() => toggleLayer("satellite")}
                title={layers.satellite ? "Hide satellite layer" : "Show satellite layer"}
              >
                <span className="flex items-center">
                  <i
                    className={classnames(
                      "fas fa-satellite mr-2",
                      layers.satellite ? "text-white" : "text-secondary"
                    )}
                  ></i>
                  Satellite
                </span>
                <i
                  className={classnames(
                    "fas",
                    layers.satellite ? "fa-toggle-on" : "fa-toggle-off",
                    "ml-2"
                  )}
                ></i>
              </Button>

              <Button
                className={classnames(
                  "flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  layers.airQuality
                    ? "bg-secondary text-white hover:bg-secondary"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
                onClick={() => toggleLayer("airQuality")}
                title={layers.airQuality ? "Hide air quality layer" : "Show air quality layer"}
              >
                <span className="flex items-center">
                  <i
                    className={classnames(
                      "fas fa-wind mr-2",
                      layers.airQuality ? "text-white" : "text-secondary"
                    )}
                  ></i>
                  Air Quality
                </span>
                <i
                  className={classnames(
                    "fas",
                    layers.airQuality ? "fa-toggle-on" : "fa-toggle-off",
                    "ml-2"
                  )}
                ></i>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLayerControls;
