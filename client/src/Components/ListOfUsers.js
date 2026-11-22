import { useSelector } from "react-redux";
import { Table } from "reactstrap";

const ListOfUsers = () => {
  const userList = useSelector((state) => state.users.value);

  return (
    <div>
      <h1>List Of Users</h1>
      <Table striped>
        <thead>
          <tr>
            <th>User's Name</th>
            <th>Email Address</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.email}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListOfUsers;
