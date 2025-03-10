const TableOperations = ({ row, onDelete }) => {
    return (
      <td className="px-4 py-2 flex gap-2">
        <button
          onClick={() => alert(`Editing ${row.name}`)}
          className="text-blue-500"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(row.id)}
          className="text-red-500"
        >
          Remove
        </button>
      </td>
    );
  };
  
  export default TableOperations;
  