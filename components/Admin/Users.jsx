import { useState } from "react";
import TableRow from "../Tables/TableRow";

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Mihai Flavius", email: "m@email.com" },
    { id: 2, name: "Iustin Cristian", email: "i@email.com" },
  ]);

  const addUser = () => {
    const name = prompt("Enter user-name:");
    const email = prompt("Enter email:");
    if (name && email) {
      const newUser = { id: Date.now(), name, email };
      setUsers([...users, newUser]);
    }
  };

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>

      <button
        onClick={addUser}
        className="bg-green-500 text-white px-4 py-2 rounded-xl mb-4"
      >
        Add User
      </button>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Modify</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <TableRow key={user.id} row={user} onDelete={deleteUser} />
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No users available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
