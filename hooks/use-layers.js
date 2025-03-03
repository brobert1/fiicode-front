import { useEffect, useState, useCallback } from "react";
import { useMap } from "@vis.gl/react-google-maps";

/**
 * Custom hook to add a traffic layer to a Google Map
 * @param {boolean} visible - Whether the layer should be visible
 */
export const useTrafficLayer = (visible) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const trafficLayer = new window.google.maps.TrafficLayer();

    if (visible) {
      trafficLayer.setMap(map);
    } else {
      trafficLayer.setMap(null);
    }

    // Cleanup: remove the layer when the component unmounts or dependencies change
    return () => {
      trafficLayer.setMap(null);
    };
  }, [map, visible]);
};

/**
 * Custom hook to add a transit layer to a Google Map
 * @param {boolean} visible - Whether the layer should be visible
 */
export const useTransitLayer = (visible) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const transitLayer = new window.google.maps.TransitLayer();

    if (visible) {
      transitLayer.setMap(map);
    } else {
      transitLayer.setMap(null);
    }

    // Cleanup: remove the layer when the component unmounts or dependencies change
    return () => {
      transitLayer.setMap(null);
    };
  }, [map, visible]);
};

/**
 * Component wrapper for the traffic layer hook.
 */
export const TrafficLayer = ({ visible }) => {
  useTrafficLayer(visible);
  return null;
};

/**
 * Component wrapper for the transit layer hook.
 */
export const TransitLayer = ({ visible }) => {
  useTransitLayer(visible);
  return null;
};

/**
 * Custom hook for managing layer toggling.
 * It returns the current layer settings along with a toggle function.
 *
 * @param {Object} initialLayers - Initial state for layers. Defaults to { traffic: true, transit: false }.
 * @returns {[Object, Function]} - An array with the layer state and the toggleLayer function.
 */
export const useLayerToggle = (initialLayers = { traffic: true, transit: false }) => {
  const [layers, setLayers] = useState(initialLayers);

  const toggleLayer = useCallback((layerName) => {
    if (layerName === "traffic") {
      setLayers({ traffic: true, transit: false });
    } else if (layerName === "transit") {
      setLayers({ traffic: false, transit: true });
    }
  }, []);

  return [layers, toggleLayer];
};
