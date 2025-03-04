import React from "react";
import MapSearchProvider from "contexts/MapSearchContext";
import DirectionsProvider from "contexts/DirectionsContext";

/**
 * Higher-order component that wraps a component with MapSearchProvider and DirectionsProvider
 * @param {React.ComponentType} Component - The component to wrap
 * @returns {React.ComponentType} - The wrapped component
 */
const withMapSearch = (Component) => {
  const WithMapSearch = (props) => {
    return (
      <DirectionsProvider>
        <MapSearchProvider>
          <Component {...props} />
        </MapSearchProvider>
      </DirectionsProvider>
    );
  };

  // Copy getInitialProps so it's available for Next.js
  if (Component.getInitialProps) {
    WithMapSearch.getInitialProps = Component.getInitialProps;
  }

  return WithMapSearch;
};

export default withMapSearch;
