# patient-community-example

This contains an example cloud service for a Patient Community, inspired by the LINDDUN example privacy analysis

## Architecture

The cloud service is built in a micro-service pattern and consists of the following components / micro-services:

* *frontend* micro-service consisting of the three sub-components *patient frontend*, *researcher frontend* and *nurse frontend*. 
* *auth* micro-service, called *session manager* in the original LINDDUN paper
* *disease* service
* *PHR* service, comprised of the *group PHR controller* and *PHR manager*
* *patient manager*
* *statistics* processor
