import React, { useState } from "react"
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { useHistory } from "react-router-dom";

interface LoginResponse {
    access_token: string;
};

export const LoginForm: React.FunctionComponent<{}> = () => {
    @PrivacyLabel(1)
    const [username, setUsername] = useState("");
    @PrivacyLabel(4)
    const [password, setPassword] = useState("");
    const history = useHistory();

    @Identifier
    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit(event: any) {
        alert('A name was submitted: ' + username);
        event.preventDefault();
        const apiUrl = process.env.REACT_APP_AUTH_URL!;

        fetch(apiUrl, {
            method: 'POST', body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
            .then((res) => res.json())
            .then((response: LoginResponse) => {
                history.push("/");
                localStorage.setItem("access_token", response.access_token);
            });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    autoFocus
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                Login
        </Button>
        </Form>
    );
}
