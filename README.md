# Patient Community Example 👩‍⚕️ 🧑‍⚕️ 👨‍⚕️

[![Build](https://github.com/clouditor/patient-community-example/actions/workflows/build.yml/badge.svg)](https://github.com/clouditor/patient-community-example/actions/workflows/build.yml)

This repository contains an example cloud service for a Patient Community, inspired by the LINDDUN example privacy analysis [1] [2] which in turn is inspired by health data platforms, where people can share their medical information with the purpose of comparing it to others with a similar medical history.

**WARNING!**

This application exhibits deliberate privacy and security weaknesses! Do not deploy it on any Internet-facing servers or using real personal data, as they can be compromised. We do not take responsibility for the way in which any one uses this application. 

## LINDDUN 
LINDDUN [3] is a privacy threat modeling approach similar to STRIDE (which is for security threat modeling).
In LINDDUN GO [4], the authors have created an adapted, more leightweight version that has a reduced set of threats.



## Architecture

The cloud service is built in a polyglot micro-service pattern and consists of the following components / micro-services:

| Service                | Description                                                                                                            |   Language |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------: |
| *frontend*             | The UI frontend consisting of the three sub-components *patient frontend*, *researcher frontend* and *nurse frontend*. | TypeScript |
| *auth*                 | Authentication backend, issues tokens for the users groups. Called *session manager* in the original LINDDUN paper     |         Go |
| *disease service*      | Patients can query this service with their symptoms to retrieve a list of possible matching diseases                                                                                                                   |  JavaScript          |
| *group PHR controller* | Consults personal health records (PHR) of all user groups in which the requesting patient is present                   |     Python |
| *phr-manager*          | Manages personal health records (PHR) of individual patients                                                           |     Python |
| *nurse-api*            | Manages users and roles. Called *patient manager* in the original LUNDDUN paper                                        |       Java |
| *statistics*           | Enables researchers to retrieve k-anonymized statistics about personal health records                                  |     Python |

An overview of the different APIs can be found in an [OpenAPI specification](https://github.com/clouditor/patient-community-example/blob/main/openapi/patient_community_openapi.yaml).

## Prerequisites

To build and start all the services locally, at least the following tools need to be available:
* NodeJS with `yarn` installed
* Java 11+
* Go 1.16
* Docker
* Python 3.9

## Usage

All services can be started with a simple start script `source ./start.sh all`. After starting, the frontend is available on http://localhost:3000. `jobs` will display a list of running services. Individual services can also be started using `source ./start.sh [service ...]`.

Alternativly, if Visual Studio Code is used, a *compound launch configuration* called **Launch all services** can be used, which automatically starts all the relevant services and allows them to be debugged.

`docker-compose` is also supported; here, two users and groups are created by default, as well as some sample PHR data. You can login with `NurseRatched` and the password `myverysecretpassword`.

## Implemented Weaknesses/Vulnerabilities

| **LINDDUN GO ID** | **Description** | **Entry point** | **Exit point** | 
|----------------------------|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **L1**                     | Linkability of credentials          | _frontend/src/PhrForm.tsx_: PHR is submitted together with a JWT                                                                                                                        | _phr-manager/app.py_: PHR manager decodes the JWT which includes the (linkable) user name                                                                                   |
| **L2**                     | Linkability of user actions         | _out of scope_                                                                                                                                                    |
| **L3**                     | Linkability of inbound data         | _frontend/src/PhrForm.tsx_: PHR is introduced and (assumed to be) sent repeatedly                                                                                                       | _phr-manager/app.py_: The PHR manager can link PHR, e.g. due to the course of disease                                                                                       |
| **L4**                     | Linkability of context              | _frontend/src/PhrForm.tsx_: user submits PHR | _phr-manager/app.py_: The PHR manager can link user request based on the IP address (and possibly other meta-data) contained in the HTTP protocol |
| **L5**                     | Linkability of shared data          | _frontend/src/CheckSymptoms.tsx_: user submits symptoms | _disease-service/_disease-service.js_: The disease service can link user request based on the symptoms provided in multiple requests |
| **L6**                     | Linkability of stored data          | _frontend/src/PhrForm.tsx_: phr is introduced and sent to the phr manager                                                                                                               | _phr-manager/app.py_: phr is stored in the patient data DB                                                                                                                  |
| **L7** | Linkability of retrieved data | _frontend/src/GetGroupPhrForm.tsx_: A user requests group PHRs | _group-phr-controller/app.py_: the group-phr-controller accesses both the User DB and the PHR DB and links the data |
| **ID1**                    | Identifying credentials             | _frontend/src/PhrForm.tsx_: PHR is submitted alongside together with a JWT                                                                                                              | _phr-manager/app.py_: PHR manager decodes the JWT which may identify the user                                                                                               |
| **ID2**                    | Actions identify user               | _out of scope_                                                                                                                                                     |
| **ID3**                    | Identifying inbound data            | _frontend/src/CheckSymptoms.tsx_: patient provides symptoms via the patient portal, which then forwards the given input.                                                                              | _disease-service/disease-service.js_: The input is received by the external diseases service. The data flow between these nodes can be intercepted and the identity of the person derived.        |
| **ID4**                    | Identifying context                 | _frontend/src/PhrForm.tsx_: user submits PHR | _phr-manager/app.py_: The PHR manager can identify the user based on the identifying meta-data, like the IP address (and possibly other meta-data) contained in the HTTP protocol |
| **ID5**                    | Identifying shared data             | _frontend/src/PhrForm.tsx_: User sends non-anoymized phr data to the phr-manager                                                                                                                   | _phr-manager/app.py_: phr manager receives phr data sent from the patient frontend.                                                                                               |
| **ID6**                    | Identifying stored data             |  _nurse-api/.../rest/UserController.java_: Nurse registers users with identifiers, including first name and last name | The user data is stored in the _User DB_ |
| **ID7** | Identifying retrieved data | _frontend/src/GetGroupPhrForm.tsx_: A user requests group PHRs | _group-phr-controller/app.py_: the group-phr-controller accesses the User DB which holds identifiers (first and last names) |
| **NR1**                    | Credentials non-repudiation         | _nurse-api/src/.../UserController.java_: nurse creates patient user including first name and last name                                                                                  | identifiers may leak from the users database                                                                                                                                       |
| **NR2**                    | Non-repudiation of sending          | _frontend/src/PhrForm.tsx_: user submits PHR                                                                                                                                                     | PHR manager logs the action including user ID and PHR                                                                                                                              |
| **NR3**                    | Non-repudiation of receipt          | _out of scope_                                                                                                                                                     |
| **NR4** | Non-reputable storage | _frontend/src/PhrForm.tsx_: PHR is sent to the phr manager | _phr-manager/app.py_: The PHR manager logs the PHR including the user ID and logs are stored externally (in the Azure Log Analytics service; note that the flow of logs to the external service cannot directly be detected from the source code or deployment information) |
| **NR5** | Non-repudiation of retrieved data | _frontend/src/PhrForm.tsx_: PHR is sent to the phr manager | _phr-manager/app.py_: The PHR manager logs the PHR including the user ID and logs are stored externally and can be retrieved via this service (in the Azure Log Analytics service; note that the flow of logs or access to them cannot directly be detected from the source code or deployment information) |
| **D1**                     | Detectable credentials               | _frontend/src/LoginForm.tsx_: The user sends login credentials to the auth service                                                                                                      | _auth/rest/login.go_: if the user is not found an HTTP 404 is returned; if the password is wrong an HTTP 403 is returned                                                    |
| **D2**                     | Detectable communication            | _frontend/src/PhrForm.tsx_: The user sends PHR to the PHR manager  | _phr-manager/app.py_: The PHR manager receives the PHR; the transmission may be observable by third parties                                                                 |
| **D3**                     | Detectable outliers                 | _out of scope_                                                                                                                                                     |
| **D4**                   | Detectable at storage               | _frontend/src/PhrForm.tsx_: The user submits PHR, specifying a custom user ID and group ID | _phr-manager/app.py_: The PHR manager returns an error if the user is not member of the specified group, leaking information about user-group assignments                   |
| **D5**                   | Detectable at retrieval             | _frontend/src/PhrForm.tsx_: The user requests group PHR, specifying a custom user ID and group ID                                                                                                | _group-phr-controller/app.py_: The group PHR controller returns an error if the user is not member of the specified group, leaking information about user-group assignments |
| **U1**                     | No transparency                     | This threat is implicit to the application since no transparency                                                                                                 |
| **U2**                     | No user-friendly privacy control    | This threat is implicit to the application since no user-friendly privacy controls, e.g. feedback and awareness tools or default settings, are implemented |
| **U3**                     | No access or portability            | This threat is implicit to the application since no possibility to access a patient's own data is implemented (only data of the complete group can be queried) |
| **U4**                     | No erasure or rectification         | This threat is implicit to the application since no possibility for erasure or rectification is implemented |
| **U5**                     | Insufficient consent support        | This threat is implicit to the application since no mechanism for consent support is implemented                                                              
| **NC1**                    | Disproportionate collection         | _nurse-api/src/.../UserController.java_: nurse creates patient user including first name and last name | first name and last name are never processed                                                                                                                                      |
| **NC2**                    | Unlawful processing                 | _out of scope_                                                                                                                                                    |
| **NC3**                    | Disproportionate processing         | _out of scope_                                                                                                                                                     |
| **NC4**                    | Automated decision making           | _out of scope_                                                                                                                                                     |
| **NC5**                    | Disproportionate storage            | _nurse-api/src/.../UserController.java_: nurse creates patient user including first name and last name                                                                                  | first name and last name are stored but never further used                                                                                                                         |
| ****                       | Disclosure of Information           | _frontend/src/PhrForm.tsx_: The user sends PHR to the PHR manager                                                                                                                                | _phr-manager/app.py_: The PHR manager receives the PHR; the transmission may be readable by third parties                                                                   |



## References

[1]: Patient Community Example LINDDUN analysis by Kim Wuyts: https://7e71aeba-b883-4889-aee9-a3064f8be401.filesusr.com/ugd/cc602e_b4f5b1fc19da49a9bb8e39f0933cadab.pdf

[2]: LINDDUN downloads: https://www.linddun.org/downloads

[3]: Deng, M., Wuyts, K., Scandariato, R., Preneel, B., & Joosen, W. (2011). A privacy threat analysis framework: supporting the elicitation and fulfillment of privacy requirements. Requirements Engineering, 16(1), 3-32.

[4]: Wuyts, K., Sion, L., & Joosen, W. (2020, September). LINDDUN GO: A Lightweight Approach to Privacy Threat Modeling. In 2020 IEEE European Symposium on Security and Privacy Workshops (EuroS&PW) (pp. 302-309). IEEE.
