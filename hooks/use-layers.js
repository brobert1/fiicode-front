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
 * Custom hook to add a satellite layer to a Google Map
 * @param {boolean} visible - Whether the layer should be visible
 */
export const useSatelliteLayer = (visible) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (visible) {
      // Use HYBRID instead of SATELLITE to show labels on the satellite imagery
      map.setMapTypeId(window.google.maps.MapTypeId.HYBRID);
    } else {
      map.setMapTypeId(window.google.maps.MapTypeId.ROADMAP);
    }

    // No cleanup needed as we're just changing the map type
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
 * Component wrapper for the satellite layer hook.
 */
export const SatelliteLayer = ({ visible }) => {
  useSatelliteLayer(visible);
  return null;
};

/**
 * Custom hook for managing layer toggling.
 * It returns the current layer settings along with a toggle function.
 *
 * @param {Object} initialLayers - Initial state for layers. Defaults to { traffic: true, transit: false, satellite: false, airQuality: false }.
 * @returns {[Object, Function]} - An array with the layer state and the toggleLayer function.
 */
export const useLayerToggle = (initialLayers = {
  traffic: true,
  transit: false,
  satellite: false,
  airQuality: false // Added airQuality to initial state
}) => {
  const [layers, setLayers] = useState(initialLayers);

  const toggleLayer = useCallback((layerName) => {
    setLayers(prevLayers => {
      if (layerName === "airQuality") {
        // Toggle airQuality independently
        return {
          ...prevLayers,
          airQuality: !prevLayers.airQuality
        };
      } else {
        // For traffic, transit, satellite - ensure only one is active, preserve airQuality
        return {
          traffic: layerName === "traffic",
          transit: layerName === "transit",
          satellite: layerName === "satellite",
          airQuality: prevLayers.airQuality // Preserve current airQuality state
        };
      }
    });
  }, []);

  return [layers, toggleLayer];
};

/**
 * Main hook that provides access to all layer-related functionality
 * @returns {Object} - Object containing all layer hooks and components
 */
const useLayers = () => {
  return {
    useTrafficLayer,
    useTransitLayer,
    useSatelliteLayer,
    useLayerToggle,
    TrafficLayer,
    TransitLayer,
    SatelliteLayer,
  };
};

export default useLayers;
