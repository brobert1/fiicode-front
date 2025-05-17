import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

const AirQualityLayer = ({ visible }) => {
  const map = useMap();
  const airQualityMapTypeRef = useRef(null); // Use a ref to store the map type instance

  useEffect(() => {
    // Ensure map instance and Google Maps API are available
    if (!map || typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
      if (map && (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined')) {
        // Map is loaded, but google.maps not yet. This case should ideally be handled by useMap or APIProvider.
        console.warn("AirQualityLayer: map is available, but google.maps is not. Retrying might be needed or check API loading.");
      }
      return;
    }

    const TILE_SIZE = 256; // Google Maps tile size

    const createLayer = () => {
      if (airQualityMapTypeRef.current) return; // Already created

      // Try multiple possible environment variable names
      const apiKey = process.env.GOOGLE_MAPS_API_KEY ||
                     process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
                     process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.error("API Key for Air Quality is missing. Check your environment variables.");
        return; // Don't create the layer without an API key
      }

      // Using U.S. AQI color scheme to match the image
      const airQualityTileLayerOptions = {
        getTileUrl: (coord, zoom) => {
          // "US_AQI" is the correct tile type for the U.S. Air Quality Index visualization
          const tileType = 'US_AQI';
          const url = `https://airquality.googleapis.com/v1/mapTypes/${tileType}/heatmapTiles/${zoom}/${coord.x}/${coord.y}?key=${apiKey}`;
          return url;
        },
        tileSize: new window.google.maps.Size(TILE_SIZE, TILE_SIZE),
        isPng: true,
        name: 'AirQuality',
        maxZoom: 16,
        minZoom: 0,
        opacity: 0.75, // Adjusted for better visibility
      };

      try {
        airQualityMapTypeRef.current = new window.google.maps.ImageMapType(airQualityTileLayerOptions);
        map.overlayMapTypes.insertAt(0, airQualityMapTypeRef.current);
      } catch (error) {
        console.error("Error creating Air Quality layer:", error);
      }
    };

    const removeLayer = () => {
      if (airQualityMapTypeRef.current && map && map.overlayMapTypes) {
        for (let i = 0; i < map.overlayMapTypes.getLength(); i++) {
          const layer = map.overlayMapTypes.getAt(i);
          if (layer === airQualityMapTypeRef.current) { // Compare instance directly
            map.overlayMapTypes.removeAt(i);
            break;
          }
        }
        airQualityMapTypeRef.current = null;
      }
    };

    if (visible) {
      createLayer();
    } else {
      removeLayer();
    }

    // Cleanup function
    return () => {
      // Check if map is still available during unmount, as map instance might be destroyed before this cleanup
      if (map && map.overlayMapTypes && airQualityMapTypeRef.current) {
         removeLayer();
      }
    };
  }, [map, visible]);

  return null;
};

export default AirQualityLayer;
