# Patient Community Example 👩‍⚕️ 🧑‍⚕️ 👨‍⚕️

[![Build](https://github.com/clouditor/patient-community-example/actions/workflows/build.yml/badge.svg)](https://github.com/clouditor/patient-community-example/actions/workflows/build.yml)

This contains an example cloud service for a Patient Community, inspired by the LINDDUN example privacy analysis [[1]] [[2]] which in turn is inspired by health data platforms, where people can share their medical information with the purpose of comparing it to others with a similar medical history.

LINDDUN [3] is a privacy threat modeling approach similar to STRIDE (which is for security threat modeling).
In LINDDUN GO [4], the authors have created an adapted, more leightweight version that has a reduced set of threats.

## Architecture

The cloud service is built in a polyglot micro-service pattern and consists of the following components / micro-services:

| Service                | Description                                                                                                            |   Language |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------: |
| *frontend*             | The UI frontend consisting of the three sub-components *patient frontend*, *researcher frontend* and *nurse frontend*. | TypeScript |
| *auth*                 | Authentication backend, issues tokens for the users groups. Called *session manager* in the original LINDDUN paper     |         Go |
| *disease service*      | Patients can query this service with their symptoms to retrieve a list of possible macthing diseases                                                                                                                   |  JavaScript          |
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

## References

[1]: https://7e71aeba-b883-4889-aee9-a3064f8be401.filesusr.com/ugd/cc602e_b4f5b1fc19da49a9bb8e39f0933cadab.pdf
[2]: https://www.linddun.org/downloads

[3]: Deng, M., Wuyts, K., Scandariato, R., Preneel, B., & Joosen, W. (2011). A privacy threat analysis framework: supporting the elicitation and fulfillment of privacy requirements. Requirements Engineering, 16(1), 3-32.

[4]: Wuyts, K., Sion, L., & Joosen, W. (2020, September). LINDDUN GO: A Lightweight Approach to Privacy Threat Modeling. In 2020 IEEE European Symposium on Security and Privacy Workshops (EuroS&PW) (pp. 302-309). IEEE.
