import { checkAuth, withAuth } from "@auth";
import { Layout } from "@components";
import AlertsFilter from "@components/Admin/AlertsFilter";
import DashboardStats from "@components/Admin/DashboardStats";
import LatestAlerts from "@components/Admin/LatestAlerts";
import AdminGoogleMap from "@components/GoogleMaps/AdminGoogleMap";
import { useState } from "react";

const Page = () => {
  const [options, setOptions] = useState({});

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        <DashboardStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-lg shadow p-4">
            <div className="flex justify-end mb-4">
              <div className="w-auto">
                <AlertsFilter setOptions={setOptions} />
              </div>
            </div>
            <AdminGoogleMap height="500px" options={options} />
          </div>
          <div className="bg-white rounded-lg shadow p-4 overflow-auto">
            <h3 className="text-lg font-medium mb-2">Latest Alerts</h3>
            <LatestAlerts />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
