import React, { useState } from "react"
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { useHistory } from "react-router-dom";
import { User } from "./Users";

@Identifier
class CreateUserRequest {
    constructor(
        public username: string = "",
        public password: string = "",
        public firstName: string = "",
        public lastName: string = "") { }
}

export const UserForm: React.FunctionComponent<{ userId?: number }> = (userId) => {
    // TODO: use one state (the request) and do a shallow merge https://medium.com/@kipropesque/shallow-merging-setstate-and-the-spread-operator-ae8e08697073

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const history = useHistory();

    function validateForm() {
        return username.length > 0 &&
            firstName.length > 0 &&
            lastName.length > 0 &&
            password.length > 0;
    }

    function handleSubmit(event: any) {
        event.preventDefault();

        const apiUrl = process.env.REACT_APP_USERS_URL!;
        const token = localStorage.getItem("access_token");

        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(new CreateUserRequest(username, password, firstName, lastName)),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((user: User) => {
                history.push("/users");
            });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    autoFocus
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    autoFocus
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    autoFocus
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validateForm()}>
                Create
        </Button>
        </Form>
    );
}
