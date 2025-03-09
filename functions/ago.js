import { formatDistance } from "date-fns";

const ago = (date) => {
  try {
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    });
  } catch (err) {
    return "";
  }
};

export default ago;
