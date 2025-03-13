import { LoadMoreOnClick } from "@components/Buttons";
import { TableError, TableLoading, TableSuccess } from "@components/Tables";
import { latestAlertsTableColumns } from "@data";
import { useInfiniteQuery } from "@hooks";

const LatestAlerts = () => {
  const { data, status, ...props } = useInfiniteQuery("/admin/alerts", {
    createdAt: -1,
  });

  return (
    <>
      {status === "error" && <TableError name="latestAlerts" columns={latestAlertsTableColumns} />}
      {status === "loading" && (
        <TableLoading name="latestAlerts" columns={latestAlertsTableColumns} />
      )}
      {status === "success" && (
        <>
          <TableSuccess
            columns={latestAlertsTableColumns}
            data={data}
            name="latestAlerts"
            {...props}
          />
          <div className="px-4 sm:p-4">
            <LoadMoreOnClick {...props} />
          </div>
        </>
      )}
    </>
  );
};

export default LatestAlerts;
