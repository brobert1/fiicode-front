import { MenuItem } from '@components';

const Pages = () => {
  return (
    <>
      <MenuItem href="/admin" level="1">
        <i className="fas fa-gauge-high mr-2" /> Dashboard
      </MenuItem>
      <MenuItem href="/admin/users">
      <i className="fa-solid fa-users mr-2"/>Users
      </MenuItem>
      <MenuItem href="/admin/partners" level="1">
        <i className="fas fa-handshake mr-2" /> Partners
      </MenuItem>
    </>
  );
};

export default Pages;
