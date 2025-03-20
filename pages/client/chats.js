import { checkAuth, withAuth } from "@auth";
import { Error, FloatingMenu, Loading } from "@components";
import BaseClientLayout from "@components/BaseClientLayout";
import { Chats } from "@components/Client";
import { useQuery } from "@hooks";

const Page = () => {
  const { data, error, status } = useQuery("/client/conversations");

  return (
    <BaseClientLayout floatingMenu={<FloatingMenu />}>
      <div className="w-full flex bg-white flex-col items-center">
        {status === "loading" && <Loading />}
        {status === "error" && <Error message={error.message} />}
        {status === "success" && <Chats conversations={data} />}
      </div>
    </BaseClientLayout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
