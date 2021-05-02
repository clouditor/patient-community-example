import React from "react";

export interface User {
    username: string
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

        return users.map((v: User) =>
            <div key={v.username}>
                {v.username}
            </div>)
    }
}