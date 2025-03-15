import { useState, useCallback } from 'react';
import { useDisclosure } from '@hooks';

/**
 * Custom hook to manage custom route modal state and functionality
 *
 * @returns {Object} State and handlers for the custom route modal
 */
const useCustomRouteModal = () => {
  const { isOpen, show, hide } = useDisclosure(false);
  const [routePath, setRoutePath] = useState([]);
  const [routeType, setRouteType] = useState('DRIVING');
  const [endpoints, setEndpoints] = useState(null);

  const showModal = useCallback((path, type = 'DRIVING', endpointsData = null) => {
    setRoutePath(path);
    setRouteType(type);
    setEndpoints(endpointsData);
    show();
  }, [show]);

  return {
    isOpen,
    hide,
    showModal,
    routePath,
    routeType,
    endpoints
  };
};

export default useCustomRouteModal;
