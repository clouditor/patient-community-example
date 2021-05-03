import { User } from "./Users";

export const UserRow: React.FunctionComponent<{ user: User }> = ({ user }) =>
    <tr key={user.username}>
        <td></td>
        <td></td>
        <td></td>
        <td>{user.username}</td>
    </tr>
