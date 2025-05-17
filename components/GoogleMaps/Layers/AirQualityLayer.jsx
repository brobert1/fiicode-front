import { useEffect, useRef, useCallback } from "react";
import { useMap } from "@vis.gl/react-google-maps";

const AirQualityLayer = ({ visible, onAirQualityData }) => {
  const map = useMap();
  const airQualityMapTypeRef = useRef(null);
  const fixedMapType = "UAQI_INDIGO_PERSIAN";

  const fetchConcentrationData = useCallback(async (latLng) => {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: {
              latitude: latLng.lat(),
              longitude: latLng.lng(),
            },
            extraComputations: [
              "POLLUTANT_CONCENTRATION",
              "DOMINANT_POLLUTANT_CONCENTRATION",
              "POLLUTANT_ADDITIONAL_INFO",
              "HEALTH_RECOMMENDATIONS",
            ],
          }),
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching concentration data:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!map || typeof window.google === "undefined" || !window.google.maps) return;

    const TILE_SIZE = 256;
    let zoomListener;
    let clickListener;

    const removeLayer = () => {
      if (airQualityMapTypeRef.current && map.overlayMapTypes) {
        for (let i = 0; i < map.overlayMapTypes.getLength(); i++) {
          if (map.overlayMapTypes.getAt(i) === airQualityMapTypeRef.current) {
            map.overlayMapTypes.removeAt(i);
            break;
          }
        }
        airQualityMapTypeRef.current = null;
      }
    };

    const createLayer = () => {
      if (airQualityMapTypeRef.current) {
        removeLayer();
      }

      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      try {
        const options = {
          getTileUrl: (coord, zoom) =>
            `https://airquality.googleapis.com/v1/mapTypes/${fixedMapType}/heatmapTiles/${zoom}/${coord.x}/${coord.y}?key=${apiKey}`,
          tileSize: new window.google.maps.Size(TILE_SIZE, TILE_SIZE),
          isPng: true,
          name: "AirQuality",
          maxZoom: 20,
          minZoom: 0,
          opacity: 0.8,
        };
        airQualityMapTypeRef.current = new window.google.maps.ImageMapType(options);
        map.overlayMapTypes.insertAt(0, airQualityMapTypeRef.current);

        // Listen for zoom changes
        zoomListener = map.addListener("zoom_changed", () => {
          // We can keep track of zoom if needed in the future
        });

        // Listen for clicks when layer is visible
        if (typeof onAirQualityData === "function") {
          clickListener = map.addListener("click", async (event) => {
            if (map.getZoom() >= 12) {
              const data = await fetchConcentrationData(event.latLng);
              if (data) {
                onAirQualityData(data);
              }
            }
          });
        }
      } catch (error) {
        console.error(`Error adding layer ${fixedMapType}:`, error);
      }
    };

    if (visible) {
      createLayer();
    } else {
      removeLayer();
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (zoomListener) window.google.maps.event.removeListener(zoomListener);
      if (clickListener) window.google.maps.event.removeListener(clickListener);
      removeLayer();
    };
  }, [map, visible, onAirQualityData, fetchConcentrationData]);

  // Export the fetch function for external use
  useEffect(() => {
    if (typeof onAirQualityData === "function") {
      onAirQualityData.fetchData = fetchConcentrationData;
    }
  }, [onAirQualityData, fetchConcentrationData]);

  return null;
};

export default AirQualityLayer;
