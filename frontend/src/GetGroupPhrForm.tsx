import React, { useState } from "react"
import { Form, Table } from "react-bootstrap";
import Button from 'react-bootstrap/Button';

export interface PHR {
    symptom: string,
    symptomStrength: string,
    medication: string
    medicationDosage: string
}

export const GetGroupPhrForm: React.FunctionComponent<{}> = () => {
    //@PseudoIdentifier
    const [userId, setUserId] = useState("");
    //@PseudoIdentifier
    const [groupId, setGroupId] = useState("");
    
    const [phr, setPhr] = useState([{ 
        symptom: '', symptomStrength: '', medication: '', medicationDosage: ''
    }])

    function validateForm() {
        return userId.length > 0
            && groupId.length > 0
    }
    
    function handleSubmit(event: any) {
        event.preventDefault();
        const apiUrl = process.env.REACT_APP_GROUP_PHR_URL!;

        fetch(apiUrl + '/groupid/' + groupId + '/userid/' + userId, {
            method: 'GET', 
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("access_token"),
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((phr) => {
            setPhr(phr)
        });
    }

    return (
        <div style={{ width: 200, marginLeft: "auto", marginRight: "auto" }}>
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUserId">
                <Form.Label>User ID</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Enter User ID" 
                    value={userId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setUserId(e.target.value);
                      }}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupId">
                <Form.Label>Group ID</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Enter Group ID" 
                    value={groupId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setGroupId(e.target.value);
                      }}
                />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validateForm()}>
                Get PHR data
            </Button>
        </Form>
        <div>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Symptom</th>
                    <th>Symptom Strength</th>
                    <th>Medication</th>
                    <th>Dosage</th>
                </tr>
            </thead>
            <tbody>
                {phr.map((phr) =>
                    <tr>
                        <td>{phr.symptom}</td>
                        <td>{phr.symptomStrength}</td>
                        <td>{phr.medication}</td>
                        <td>{phr.medicationDosage}</td>
                    </tr>
                )}
            </tbody>
        </Table>
        </div>
        </div>
    );
}
