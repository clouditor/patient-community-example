import React from "react"
import { Form, Table } from "react-bootstrap";
import Button from 'react-bootstrap/Button';

export interface State {
    symptom: string,
    diseases: string[],
    username: username
}

export class CheckSymptoms extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);

        this.state = {
            symptom: 'amnesia',
            diseases: ['Corona'],
            username: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    @PseudoIdentifier
    public handleSubmit(event: any) {        
        event.preventDefault();

        const apiUrl = process.env.REACT_APP_DISEASE_URL!;
        const token = localStorage.getItem("access_token");

        let symptomsArray = this.state.symptom.split(",") // mutliple symptoms can be put in as csv

        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({
                "symptoms": symptomsArray,
                "username": this.state.username
            }),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((diseases: string[]) => {
                this.setState({ diseases: diseases })
            });
    }

    public render() {
        const { symptom, diseases, username } = this.state;

        return <div>
        <div style={{ width: 200, marginLeft: "auto", marginRight: "auto" }}>
        <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="symptom">
                <Form.Label>Symptom</Form.Label>
                <Form.Control
                    autoFocus
                    type="text"
                    value={symptom}
                    onChange={(e) => this.setState({symptom: e.target.value})}
                />
            </Form.Group>
            <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    autoFocus
                    type="text"
                    value={username}
                    onChange={(e) => this.setState({symptom: e.target.value})}
                />
            </Form.Group>
            <Button block size="lg" type="submit">
                Add
            </Button>
        </Form>
        </div>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Disease</th>
                </tr>
            </thead>
            <tbody>
                {diseases.map((disease: string) =>
                    <tr>
                        <td>{disease}</td>
                    </tr>
                )}
            </tbody>
        </Table>
        </div>
    }
}