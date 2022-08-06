import React, { useState } from "react"
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
<<<<<<< HEAD

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
=======
import { useHistory } from "react-router-dom";

export const PhrForm: React.FunctionComponent<{}> = () => {
    const [phr_data, setPhr_data] = useState("");

    function validateForm() {
        return phr_data.length > 0;
    }
    
    //@PseudoIdentifier
    function handleSubmit(event: any) {
        alert('PHR data was submitted: ' + phr_data);
>>>>>>> main
        event.preventDefault();
        const apiUrl = process.env.REACT_APP_PHR_URL!;

        fetch(apiUrl, {
<<<<<<< HEAD
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
=======
            method: 'POST', body: JSON.stringify({
                "phr_data": phr_data
>>>>>>> main
            })
        })
            .then((res) => res.json())
    }

<<<<<<< HEAD
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
=======
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
>>>>>>> main
                />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validateForm()}>
                Submit data
            </Button>
        </Form>
    );
}
