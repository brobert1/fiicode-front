import { Ago } from "@components";
import { AdressCell } from "@components/TableCells";

export default [
  {
    Header: "#",
    accessor: "no",
    extraClass: "w-10",
  },
  {
    Header: "Address",
    accessor: "location.address",
    Cell: AdressCell,
  },
  {
    Header: "Type",
    accessor: "type",
    Cell: ({ value }) => value.charAt(0).toUpperCase() + value.slice(1),
  },
  {
    Header: "Reported",
    accessor: "createdAt",
    Cell: Ago,
  },
];
