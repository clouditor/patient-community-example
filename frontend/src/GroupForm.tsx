import React, { useState } from "react"
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { useHistory } from "react-router-dom";
import { Group } from "./Groups";

class CreateGroupRequest {
    constructor(
        public name: string = "") { }
}

export const GroupForm: React.FunctionComponent<{ groupId?: number }> = (groupId) => {
    // TODO: use one state (the request) and do a shallow merge https://medium.com/@kipropesque/shallow-merging-setstate-and-the-spread-operator-ae8e08697073
    const [name, setName] = useState("");

    const history = useHistory();

    function validateForm() {
        return name.length > 0;
    }

    function handleSubmit(event: any) {
        event.preventDefault();

        const apiUrl = process.env.REACT_APP_GROUPS_URL!;
        const token = localStorage.getItem("access_token");

        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(new CreateGroupRequest(name)),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((group: Group) => {
                history.push("/groups");
            });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validateForm()}>
                Create
        </Button>
        </Form>
    );
}
