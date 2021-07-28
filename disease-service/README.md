The disease service is a JavaScript service. It performs a simple mapping of incoming queries containing a list of symptoms, to possible diseases which can trigger the symptoms. The mapping is based on a static mapping contained in the ```symptomsToDiseases/``` directory.

| URL      | Method |  Description                  |
| -------- | ------ | ----------------------------- |
| `/api/v1/diseases`  | POST   | Expects a string array of symptoms and returns an array of diseases. |


# Test the Disease Service locally

This service is a JavaScript service, and can be started locally using ```node disease-service.js```. An example query to test the service is ```curl --request POST --url 'http://localhost:8086/api/v1/diseases' --header 'Content-Type: application/json'   --data '[ "swelling", "amnesia" ]'
```
