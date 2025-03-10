import { checkAuth, withAuth } from "@auth";
import { Layout } from "@components";
import Clients from "@components/Admin/Clients";

const Page = () => {
  return (
    <Layout title="Clients">
      <div className="bg-white rounded-lg p-4">
        <Clients />
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
