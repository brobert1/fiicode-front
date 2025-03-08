import { Button } from "@components";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if the device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Handle Android install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show iOS prompt if the app is not installed
    if (isIOSDevice && !window.navigator.standalone) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error("Error installing PWA:", error);
    } finally {
      setDeferredPrompt(null);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Modal show={showPrompt} onHide={handleClose} centered className="pwa-install-modal">
      <div className="p-6 text-center">
        <Button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <i className="fas fa-times text-xl" />
        </Button>

        <div className="mx-auto mb-6 h-24 w-24 rounded-xl bg-gray-100">
          <img
            src="/favicon.png"
            alt="Pathly App Icon"
            className="h-full w-full rounded-xl object-cover"
          />
        </div>
        <h2 className="mb-3 text-2xl font-bold">Install Pathly App</h2>
        <p className="mb-8 text-gray-600">
          Get the full experience with our app. It's faster, gives you real-time notifications, and
          feels like a native app.
        </p>

        {isIOS ? (
          <div className="text-left space-y-4">
            <p className="font-medium">To install, follow these steps:</p>
            <ol className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2 text-green-500">1.</span>
                Tap the <span className="font-bold mx-1">Share</span> button
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">2.</span>
                Select <span className="font-bold mx-1">Add to Home Screen</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">3.</span>
                Tap <span className="font-bold mx-1">Add</span> to install
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <i className="fas fa-check text-green-500" />
              <span>Works offline</span>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <i className="fas fa-check text-green-500" />
              <span>Faster loading times</span>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <i className="fas fa-check text-green-500" />
              <span>Native app experience</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {!isIOS && (
            <Button
              onClick={handleInstallClick}
              className="w-full rounded-xl bg-black py-3 text-white font-medium hover:bg-gray-900 transition-colors"
            >
              Install Now
            </Button>
          )}
          <Button
            onClick={handleClose}
            className="w-full rounded-xl border mt-4 border-gray-200 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PWAInstallPrompt;
