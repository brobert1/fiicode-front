import { checkAuth, withAuth } from "@auth";
import { FloatingMenu } from "@components";
import BaseClientLayout from "@components/BaseClientLayout";
import Notifications from "@components/Client/Notifications/Notifications";

const Page = () => {
  return (
    <BaseClientLayout floatingMenu={<FloatingMenu />}>
      <div className="w-full flex bg-white flex-col items-center gap-8 py-6">
        <Notifications />
      </div>
    </BaseClientLayout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
