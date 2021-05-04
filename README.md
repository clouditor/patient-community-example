# Patient Community Example

[![Build](https://github.com/clouditor/patient-community-example/actions/workflows/build.yml/badge.svg)](https://github.com/clouditor/patient-community-example/actions/workflows/build.yml)

This contains an example cloud service for a Patient Community, inspired by the LINDDUN example privacy analysis [1] [2] which in turn is inspired by health data platforms, like https://www.patientslikeme.com/, where people can share their medical information with the purpose of comparing it to others with a similar medical history.

LINDDUN [3] is a privacy threat modeling approach similar to STRIDE (which is for security threat modeling).
In LINDDUN GO [4], the authors have created an adapted, more leightweight version that has a reduced set of threats.

## Architecture

The cloud service is built in a micro-service pattern and consists of the following components / micro-services:

* *frontend* micro-service consisting of the three sub-components *patient frontend*, *researcher frontend* and *nurse frontend*. 
* *auth* micro-service, called *session manager* in the original LINDDUN paper
* *disease* service
* *PHR* service, comprised of the *group PHR controller* and *PHR manager*
* *patient manager*
* *statistics* processor

## Prerequisites

To build and start all the services locally, at least the following tools need to be available:
* NodeJS with `yarn` installed
* Java 11+
* Go 1.16
* Docker
* Python 3.9

## Usage

All services can be started with a simple start script `source ./start.sh all`. After starting, the frontend is available on http://localhost:3000. `jobs` will display a list of running services. Individual services can also be started using `source ./start.sh [service ...]`.

In the future `docker-compose` support will be added.

## References

[1]: https://7e71aeba-b883-4889-aee9-a3064f8be401.filesusr.com/ugd/cc602e_b4f5b1fc19da49a9bb8e39f0933cadab.pdf
[2]: https://www.linddun.org/downloads

[3]: Deng, M., Wuyts, K., Scandariato, R., Preneel, B., & Joosen, W. (2011). A privacy threat analysis framework: supporting the elicitation and fulfillment of privacy requirements. Requirements Engineering, 16(1), 3-32.

[4]: Wuyts, K., Sion, L., & Joosen, W. (2020, September). LINDDUN GO: A Lightweight Approach to Privacy Threat Modeling. In 2020 IEEE European Symposium on Security and Privacy Workshops (EuroS&PW) (pp. 302-309). IEEE.
