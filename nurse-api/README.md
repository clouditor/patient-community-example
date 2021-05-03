# Nurse Portal API

This contains the API for the *Nurse Portal* process.

## Usage

The applicaiton can be started using gradle.

```
./gradlew bootRun
```

The nurse is basically an administrator. They can list and manage users. 

```
curl -H "Authorization: Bearer $ACCESS_TOKEN" -v localhost:8081/api/v1/users
curl -v -XPOST -H 'Content-Type: application/json' -d '{"username": "My User", "password": "thiswillbehashed", "role": "PATIENT"}' localhost:8081/api/v1/users
```
