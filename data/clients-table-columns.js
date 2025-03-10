import { Time } from "@components";

export default [
  {
    Header: "#",
    accessor: "no",
    extraClass: "w-10",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "E-mail",
    accessor: "email",
  },
  {
    Header: "Created at",
    accessor: "createdAt",
    Cell: Time,
  },
];
