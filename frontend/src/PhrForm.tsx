import React, { useState } from "react"
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { useHistory } from "react-router-dom";

export const PhrForm: React.FunctionComponent<{}> = () => {
    @PseudoIdentifier
    const [phr_data, setPhr_data] = useState("");

    function validateForm() {
        return phr_data.length > 0;
    }
    
    function handleSubmit(event: any) {
        alert('PHR data was submitted: ' + phr_data);
        event.preventDefault();
        const apiUrl = process.env.REACT_APP_PHR_URL!;

        fetch(apiUrl, {
            method: 'POST', body: JSON.stringify({
                "phr_data": phr_data
            })
        })
            .then((res) => res.json())
    }

    // TODO: align phr data model
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="PHR Data">
                <Form.Label>PHR</Form.Label>
                <Form.Control
                    autoFocus
                    type="text"
                    value={phr_data}
                    onChange={(e) => setPhr_data(e.target.value)}
                />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validateForm()}>
                Submit data
            </Button>
        </Form>
    );
}
