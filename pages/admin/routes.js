import { checkAuth, withAuth } from "@auth";
import { Layout } from "@components";
import { AdminRouteMap } from "@components/Admin";

const Page = () => {
  return (
    <Layout title="Custom Routes">
      <div className="container mx-auto px-4 py-8">
        {/* Map Component */}
        <div className="mb-6" style={{ height: "600px" }}>
          <AdminRouteMap height="100%" />
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
