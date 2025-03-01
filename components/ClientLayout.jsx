import { FloatingMenu } from "@components";
import MapSearchProvider from "contexts/MapSearchContext";

const ClientLayout = ({ children }) => {
  return (
    <MapSearchProvider>
      <div className="flex min-h-screen font-body text-sm">
        <main className="h-screen w-full relative">
          <div className="h-full w-full">{children}</div>
          <FloatingMenu />
        </main>
      </div>
    </MapSearchProvider>
  );
};

export default ClientLayout;
