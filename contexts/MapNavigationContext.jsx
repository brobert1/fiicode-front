import { createContext, useState, useContext, useRef, useCallback } from "react";

// Create context for map navigation
export const MapNavigationContext = createContext({
  navigateToLocation: () => {},
  targetLocation: null,
  setTargetLocation: () => {},
});

// Provider component to wrap around the app
export const MapNavigationProvider = ({ children }) => {
  const [targetLocation, setTargetLocation] = useState(null);
  const lastNavigationTimeRef = useRef(0);

  // Function to navigate to a specific location
  const navigateToLocation = useCallback((location) => {
    // Always force a new navigation by adding a timestamp
    const now = Date.now();
    setTargetLocation({
      ...location,
      timestamp: now // Add timestamp to force the effect to run again
    });
    lastNavigationTimeRef.current = now;
  }, []);

  // Provide the context value to children
  return (
    <MapNavigationContext.Provider
      value={{
        navigateToLocation,
        targetLocation,
        setTargetLocation,
      }}
    >
      {children}
    </MapNavigationContext.Provider>
  );
};

// Custom hook to use the context
export const useMapNavigation = () => useContext(MapNavigationContext);
