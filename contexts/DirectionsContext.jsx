import React, { createContext, useState } from "react";

export const DirectionsContext = createContext();

export const DirectionsProvider = ({ children }) => {
  const [directions, setDirections] = useState(null);

  return (
    <DirectionsContext.Provider
      value={{
        directions,
        setDirections
      }}
    >
      {children}
    </DirectionsContext.Provider>
  );
};

export default DirectionsProvider;
