import { checkAuth, withAuth } from "@auth";
import { Layout } from "@components";
import { Partners } from "@components/Admin";

const Page = () => {
  return (
    <Layout title="Partners">
      <Partners />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
