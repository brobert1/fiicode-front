import { checkAuth, withAuth } from "@auth";
import { ClientLayout } from "@components";
import { GoogleMap } from "@components/GoogleMaps";
import MapSearchProvider from "contexts/MapSearchContext";

const Page = () => {
  return (
    <MapSearchProvider>
      <ClientLayout>
        <div className="h-full w-full">
          <GoogleMap />
        </div>
      </ClientLayout>
    </MapSearchProvider>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
