import { checkAuth, withAuth } from "@auth";
import { BaseClientLayout, FloatingMenu } from "@components";
import ChatWindow from "@components/Chat/ChatWindow";

const Page = () => {
  return (
    <BaseClientLayout floatingMenu={<FloatingMenu />}>
      <div className="max-w-full h-[100dvh] px-2 sm:px-8 py-2 flex flex-col">
        <div className="flex-1 min-h-0 flex flex-col">
          <ChatWindow />
        </div>
      </div>
    </BaseClientLayout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);