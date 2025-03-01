import { checkAuth, withAuth } from "@auth";
import { ClientLayout } from "@components";
import { GoogleMap } from "@components/GoogleMaps";
import { useUserLocation } from "@hooks";
import MapSearchProvider from "contexts/MapSearchContext";

const Page = () => {
  const { location, loading, error, refreshLocation } = useUserLocation();

  return (
    <MapSearchProvider>
      <ClientLayout>
        <div className="h-full w-full">
          <GoogleMap {...{ location, loading, error, refreshLocation }} />
        </div>
      </ClientLayout>
    </MapSearchProvider>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
