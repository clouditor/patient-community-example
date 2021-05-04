import React from "react";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

export interface User {
    id: number
    username: string
    firstName: string
    lastName: string
}

export interface UsersState {
    users: User[];
}

export class Users extends React.Component<{}, UsersState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            users: []
        }
    }

    public componentDidMount() {
        const apiUrl = `/api/v1/users`;

        const token = localStorage.getItem("access_token");

        fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((users) => {
                this.setState({ users: users })
            });
    }

    public render() {
        const { users } = this.state;

        return <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: User) =>
                        <tr key={user.username}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.username}</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Link to="/users/new"><Button>New</Button></Link>
        </div>
    }
}