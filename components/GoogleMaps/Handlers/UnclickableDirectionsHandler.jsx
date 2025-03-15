import { useUnclickableDirections } from "@hooks";

const UnclickableDirectionsHandler = ({ directions, routeInfo }) => {
  // Use our custom hook to render unclickable directions
  useUnclickableDirections({ directions, routeInfo });

  return null;
};

export default UnclickableDirectionsHandler;
