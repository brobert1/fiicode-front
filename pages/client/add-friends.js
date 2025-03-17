import { checkAuth, withAuth } from "@auth";
import { FloatingMenu } from "@components";
import BaseClientLayout from "@components/BaseClientLayout";
import { AddFriendsList } from "@components/Client";

const Page = () => {
  return (
    <BaseClientLayout floatingMenu={<FloatingMenu />}>
      <div className="w-full flex bg-white flex-col items-center gap-8 py-6">
        <AddFriendsList />
      </div>
    </BaseClientLayout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
