import React from "react";
import MapSearchProvider from "contexts/MapSearchContext";

/**
 * Higher-order component that wraps a component with MapSearchProvider
 * @param {React.ComponentType} Component - The component to wrap
 * @returns {React.ComponentType} - The wrapped component
 */
const withMapSearch = (Component) => {
  const WithMapSearch = (props) => {
    return (
      <MapSearchProvider>
        <Component {...props} />
      </MapSearchProvider>
    );
  };

  // Copy getInitialProps so it's available for Next.js
  if (Component.getInitialProps) {
    WithMapSearch.getInitialProps = Component.getInitialProps;
  }

  return WithMapSearch;
};

export default withMapSearch;
