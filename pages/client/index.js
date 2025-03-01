import { checkAuth, withAuth } from "@auth";
import { MapClientLayout } from "@components";
import { GoogleMap } from "@components/GoogleMaps";
import { useUserLocation } from "@hooks";
import withMapSearch from "@components/withMapSearch";

const Page = () => {
  const { location, loading, error, refreshLocation } = useUserLocation();

  return (
    <MapClientLayout>
      <div className="h-full w-full">
        <GoogleMap {...{ location, loading, error, refreshLocation }} />
      </div>
    </MapClientLayout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(withMapSearch(Page));
