import { useState, useEffect } from "react";

/**
 * Hook to determine color scheme based on time of day
 * Returns "DARK" if it's after 6 PM or before 6 AM, "LIGHT" otherwise
 */
const useColorScheme = () => {
  const [colorScheme, setColorScheme] = useState("LIGHT");

  useEffect(() => {
    // Function to update color scheme based on current time
    const updateColorScheme = () => {
      const currentHour = new Date().getHours();
      // Set to dark mode if it's after 6 PM (18:00) or before 6 AM (6:00)
      const isDarkTime = currentHour >= 18 || currentHour < 6;
      const newColorScheme = isDarkTime ? "DARK" : "LIGHT";

      if (newColorScheme !== colorScheme) {
        setColorScheme(newColorScheme);
      }
    };

    // Update color scheme immediately
    updateColorScheme();

    // Set up interval to check time every minute
    const intervalId = setInterval(updateColorScheme, 60000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [colorScheme]);

  return colorScheme;
};

export default useColorScheme;
