import { checkAuth, withAuth } from "@auth";
import { MapClientLayout, PWAInstallPrompt } from "@components";
import { GoogleMap } from "@components/GoogleMaps";
import { useMutation, useUserLocation } from "@hooks";
import withMapSearch from "@components/withMapSearch";
import { useState, useEffect } from "react";
import { updateLocation } from "@api/client";

const Page = () => {
  const mutation = useMutation(updateLocation);
  const { location, loading, error, refreshLocation } = useUserLocation();

  const [handleGetDirections, setHandleGetDirections] = useState(null);

  const storeHandleGetDirections = (getDirectionsFunc) => {
    if (getDirectionsFunc) {
      setHandleGetDirections(() => getDirectionsFunc);
    }
  };

  useEffect(() => {
    if (location && !loading && !error) {
      mutation.mutate(location);
    }
  }, [location, loading, error]);

  return (
    <MapClientLayout onGetDirections={handleGetDirections}>
      <div className="h-full w-full">
        <GoogleMap
          location={location}
          loading={loading}
          error={error}
          refreshLocation={refreshLocation}
          onStoreHandleGetDirections={storeHandleGetDirections}
        />
        <PWAInstallPrompt />
      </div>
    </MapClientLayout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(withMapSearch(Page), {
  role: "client",
  checkAuth,
});
