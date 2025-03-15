/**
 * Format distance in meters to a human-readable string
 *
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    // Round to the nearest 10 meters for values under 1km
    const roundedMeters = Math.round(meters / 10) * 10;
    return `${roundedMeters} m`;
  }

  // For values over 1km, round to 1 decimal place
  // For values over 10km, round to whole numbers
  if (meters < 10000) {
    return `${(meters / 1000).toFixed(1)} km`;
  } else {
    return `${Math.round(meters / 1000)} km`;
  }
};

/**
 * Format duration in seconds to a human-readable string
 *
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes} min`;
};

/**
 * Get travel mode icon class
 *
 * @param {string} mode - Travel mode (DRIVING, WALKING, etc.)
 * @returns {string} Font Awesome icon class
 */
export const getTravelModeIcon = (mode) => {
  switch (mode) {
    case "DRIVING":
      return "fa-car";
    case "WALKING":
      return "fa-walking";
    case "BICYCLING":
      return "fa-bicycle";
    case "TRANSIT":
      return "fa-bus";
    default:
      return "fa-car";
  }
};

/**
 * Calculate estimated duration based on travel mode and distance
 *
 * @param {number} distanceMeters - Distance in meters
 * @param {string} mode - Travel mode ('WALKING' or 'DRIVING')
 * @returns {number} Estimated duration in seconds
 */
export const calculateEstimatedDuration = (distanceMeters, mode) => {
  // Only WALKING and DRIVING are supported for custom routes
  let speedMetersPerSecond;
  switch (mode) {
    case 'WALKING':
      // Average walking speed: ~5 km/h = ~1.4 m/s
      speedMetersPerSecond = 1.4;
      break;
    case 'DRIVING':
    default:
      // Average driving speed: ~50 km/h = ~13.9 m/s
      speedMetersPerSecond = 13.9;
      break;
  }

  // Calculate duration in seconds
  return Math.round(distanceMeters / speedMetersPerSecond);
};
