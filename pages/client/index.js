import { checkAuth, withAuth } from "@auth";
import { ClientLayout } from "@components";
import { GoogleMap } from "@components/GoogleMaps";

const Page = () => {
  return (
    <ClientLayout>
      <div className="h-full w-full">
        <GoogleMap />
      </div>
    </ClientLayout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
