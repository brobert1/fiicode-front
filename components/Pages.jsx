import { MenuItem } from "@components";

const Pages = () => {
  return (
    <>
      <MenuItem href="/admin" level="1">
        <i className="fas fa-gauge-high mr-2" /> Dashboard
      </MenuItem>
      <MenuItem href="/admin/clients" level="1">
        <i className="fas fa-users mr-2" /> Clients
      </MenuItem>
      <MenuItem href="/admin/partners" level="1">
        <i className="fas fa-handshake mr-2" /> Partners
      </MenuItem>
    </>
  );
};

export default Pages;
