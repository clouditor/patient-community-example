import React, { useState } from "react"
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';

export const PhrForm: React.FunctionComponent<{}> = () => {
    //@PseudoIdentifier
    const [userId, setUserId] = useState("");
    //@PseudoIdentifier
    const [groupId, setGroupId] = useState("");
    //@PseudoIdentifier
    const [symptom, setSymptom] = useState("");
    //@PseudoIdentifier
    const [symptomStrength, setsymptomStrength] = useState("");
    //@PseudoIdentifier
    const [medication, setMedication] = useState("");
    //@PseudoIdentifier
    const [medicationDosage, setMedicationDosage] = useState("");

    function validateForm() {
        return userId.length > 0
            && groupId.length > 0
            && symptom.length > 0
            && symptomStrength.length > 0
            && medication.length > 0
            && medicationDosage.length > 0;
    }
    
    function handleSubmit(event: any) {
        alert('PHR data was submitted');
        event.preventDefault();
        const apiUrl = process.env.REACT_APP_PHR_URL!;

        fetch(apiUrl, {
            method: 'POST', 
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("access_token"),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": userId,
                "groupId": groupId,
                "symptom": symptom,
                "symptomStrength": symptomStrength,
                "medication": medication,
                "medicationDosage": medicationDosage,
            })
        })
            .then((res) => res.json())
    }

    return (
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
            <Form.Group className="mb-3" controlId="formSymptom">
                <Form.Label>Symptom</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Enter symptom" 
                    value={symptom}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSymptom(e.target.value);
                      }}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSymptomStrength">
                <Form.Label>Symptom Strength (between 1-10)</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Enter symptom strength" 
                    value={symptomStrength}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setsymptomStrength(e.target.value);
                      }}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formMedication">
                <Form.Label>Medication</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Enter medication" 
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formMedicationDosage">
                <Form.Label>Medication Dosage</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Enter medication dosage" 
                    value={medicationDosage}
                    onChange={(e) => setMedicationDosage(e.target.value)}
                />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validateForm()}>
                Submit data
            </Button>
        </Form>
    );
}
