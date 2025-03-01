import { FloatingMenu } from "@components";

const ClientLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen font-body text-sm">
      <main className="h-screen w-full relative">
        <div className="h-full w-full">{children}</div>
        <FloatingMenu />
      </main>
    </div>
  );
};

export default ClientLayout;
