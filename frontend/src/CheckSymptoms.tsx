import React from "react"
import { Form, Table } from "react-bootstrap";
import Button from 'react-bootstrap/Button';


class CheckSymptomsRequest {
    constructor(
        public symptoms: string[]
    ) { }
}

export interface State {
    symptom: string,
    diseases: string[]
}

export class CheckSymptoms extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);

        this.state = {
            symptom: 'amnesia',
            diseases: ['Corona']
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public handleSubmit(event: any) {
        event.preventDefault();

        const apiUrl = `/api/v1/diseases`;
        const token = localStorage.getItem("access_token");

        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(new CheckSymptomsRequest([this.state.symptom])),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((diseases: any) => {
                console.log("received diseases: " + diseases);
                this.setState({ diseases: diseases })
            });
    }

    public render() {
        const { symptom, diseases } = this.state;

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
                {diseases.map((disease) =>
                    <tr>
                        <td>{disease}</td>
                    </tr>
                )}
            </tbody>
        </Table>
        </div>
    }
}