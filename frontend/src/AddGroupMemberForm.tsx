import React, { useState } from "react"
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { useHistory } from "react-router-dom";
import { Group } from "./Groups";

class AddGroupMemberRequest {
    constructor(
        public groupId: number,
        @Identifier public userId: number) { }
}

export const AddGroupMemberForm: React.FunctionComponent<{ groupId: number }> = (props) => {
    // TODO: use one state (the request) and do a shallow merge https://medium.com/@kipropesque/shallow-merging-setstate-and-the-spread-operator-ae8e08697073
    const [userId, setUserId] = useState("");

    const history = useHistory();

    function validateForm() {
        return userId != undefined;
    }

    function handleSubmit(event: any) {
        event.preventDefault();

        const apiUrl = process.env.REACT_APP_USERS_URL! + `/members`;
        const token = localStorage.getItem("access_token");

        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(new AddGroupMemberRequest(props.groupId, +userId)),
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
            <Form.Group controlId="userId">
                <Form.Label>User Id</Form.Label>
                <Form.Control
                    autoFocus
                    type="number"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validateForm()}>
                Add
        </Button>
        </Form>
    );
}
