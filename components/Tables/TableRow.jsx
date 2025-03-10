import TableOperations from "../Admin/TableOperations";

const TableRow = ({ row, onDelete }) => {
  return (
    <tr>
      <td className="px-4 py-2">{row.name}</td>
      <td className="px-4 py-2">{row.email}</td>
      <TableOperations row={row} onDelete={onDelete} />
    </tr>
  );
};

export default TableRow;
