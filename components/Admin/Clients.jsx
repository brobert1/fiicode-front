import { LoadMoreOnClick } from "@components/Buttons";
import { TableColumns, TableError, TableLoading, TableSuccess } from "@components/Tables";
import { clientsTableColumns } from "@data";
import { useInfiniteQuery } from "@hooks";

const Clients = ({ options }) => {
  const { data, status, ...props } = useInfiniteQuery("/admin/clients", options);

  return (
    <>
      <TableColumns pageParams={data?.pageParams} />
      {status === "error" && <TableError name="clients" columns={clientsTableColumns} />}
      {status === "loading" && <TableLoading name="clients" columns={clientsTableColumns} />}
      {status === "success" && (
        <>
          <TableSuccess columns={clientsTableColumns} data={data} name="clients" {...props} />
          <div className="px-4 sm:p-4">
            <LoadMoreOnClick {...props} />
          </div>
        </>
      )}
    </>
  );
};

export default Clients;
