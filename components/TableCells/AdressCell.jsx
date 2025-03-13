import { Trim } from "@components";

const AdressCell = ({ row }) => {
  return <Trim value={row?.original?.location?.address} limit={20} />;
};

export default AdressCell;
