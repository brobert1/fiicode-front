const truncate = (str, limit) => {
  if (!str) {
    return "";
  }
  return str.length > limit ? str.slice(0, limit - 4) + "..." : str;
};

export default truncate;
