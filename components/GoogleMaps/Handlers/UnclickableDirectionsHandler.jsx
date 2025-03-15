import { useUnclickableDirections } from "@hooks";

/**
 * Component to display directions with unclickable polylines
 *
 * @param {Object} props - Component props
 * @param {Object} props.directions - The directions object from Google Maps API
 * @param {Object} props.routeInfo - Information about the route
 * @returns {null} This component doesn't render any visible elements
 */
const UnclickableDirectionsHandler = ({ directions, routeInfo }) => {
  // Use our custom hook to render unclickable directions
  useUnclickableDirections({ directions, routeInfo });

  // This component doesn't render anything visible
  return null;
};

export default UnclickableDirectionsHandler;
