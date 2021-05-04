import React from "react";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { User } from "./Users";

export interface Group {
    id: number
    name: string
    members: User[];
}

export interface GroupsState {
    groups: Group[];
}

export class Groups extends React.Component<{}, GroupsState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            groups: []
        }
    }

    public componentDidMount() {
        const apiUrl = `/api/v1/groups`;

        const token = localStorage.getItem("access_token");

        fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((groups) => {
                this.setState({ groups: groups })
            });
    }

    public render() {
        const { groups } = this.state;

        return <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group: Group) =>
                        <tr key={group.name}>
                            <td>{group.id}</td>
                            <td>{group.name}</td>
                            <td>{group.members.map(user => <div>{user.username}</div>)}
                                <Link to={`/groups/${group.id}/members/add`}><Button>Add Member</Button></Link>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Link to="/groups/new"><Button>New</Button></Link>
        </div>
    }
}