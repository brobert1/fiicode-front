import { MenuItem } from "@components";

const Pages = () => {
  return (
    <>
      <MenuItem href="/admin" level="1">
        <i className="fas fa-gauge-high mr-2" /> Dashboard
      </MenuItem>
<<<<<<< HEAD
      <MenuItem href="/admin/clients" level="1">
        <i className="fas fa-handshake mr-2" /> Clients
=======
      <MenuItem href="/admin/users">
      <i className="fa-solid fa-users mr-2"/>Users
>>>>>>> b6c97360d379bbb4df1aa8ca420b8fc01b4300d0
      </MenuItem>
      <MenuItem href="/admin/partners" level="1">
        <i className="fas fa-handshake mr-2" /> Partners
      </MenuItem>
    </>
  );
};

export default Pages;
