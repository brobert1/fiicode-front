const getDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/android/.test(userAgent)) return "Android";
  if (/iphone|ipad|ipod/.test(userAgent)) return "iOS";
  if (/win/.test(userAgent)) return "Windows PC";
  if (/mac/.test(userAgent)) return "Mac";
  if (/linux/.test(userAgent)) return "Linux";

  return "Unknown Device";
};

export default getDeviceType;
