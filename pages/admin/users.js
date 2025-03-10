import { checkAuth, withAuth } from "@auth";
import { Layout } from "@components";
import   Users from "@components/Admin/Users";

const Page = () => {
  return (
    <Layout title="Users">
      <Users />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
