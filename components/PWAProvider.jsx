import { useEffect, useState } from 'react';

const PWAProvider = ({ children }) => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      // Register the service worker
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          // Successfully registered service worker
          setRegistration(reg);

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setIsUpdateAvailable(true);
              }
            });
          });
        })
        .catch(() => {
          // Handle registration error silently
        });

      // Detect controller change
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  // Function to update the service worker
  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      // Send message to service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return (
    <>
      {children}

      {/* Update notification */}
      {isUpdateAvailable && (
        <div className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white p-4 flex justify-between items-center z-50">
          <p>A new version is available!</p>
          <button
            onClick={updateServiceWorker}
            className="bg-white text-indigo-600 px-4 py-2 rounded font-medium"
          >
            Update
          </button>
        </div>
      )}
    </>
  );
};

export default PWAProvider;
