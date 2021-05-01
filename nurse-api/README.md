# Nurse Portal API

This contains the API for the *Nurse Portal* process.

## Usage

The nurse is basically an administrator. They can list and manage users. 

```
curl -v localhost:8081/api/v1/users
curl -v -XPOST -H 'Content-Type: application/json' -d '{"username": "My User", "password": "thiswillbehashed", "role": "PATIENT"}' localhost:8081/api/v1/users
```
