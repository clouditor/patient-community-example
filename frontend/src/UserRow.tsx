import { User } from "./Users";

export const UserRow: React.FunctionComponent<{ user: User }> = ({ user }) =>
    <tr key={user.username}>
        <td>{user.id}</td>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.username}</td>
    </tr>
