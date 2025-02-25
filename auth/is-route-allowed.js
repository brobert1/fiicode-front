import jwt from 'jsonwebtoken';

const isRouteAllowed = (pathname, token) => {
  if (!pathname || !token) {
    console.error('Invalid pathname or token:', { pathname, token });
    return false;
  }

  try {
    const { role } = jwt.decode(token);

    if (!role) {
      console.error('Role missing in token:', token);
      return false;
    }
    return pathname.startsWith(`/${role}`);
  } catch (error) {
    console.error('Token decoding error:', error);
    return false;
  }
};

export default isRouteAllowed;
