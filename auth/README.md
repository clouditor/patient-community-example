# Authentication Service

This represents the *authentication* micro-service. It offers a simple REST based API with the following endpoints.

| URL      | Method |  Description                  |
| -------- | ------ | ----------------------------- |
| `/auth/login`  | POST   | User login and token creation |
| `/auth/userinfo` | POST | Retrieves OAuth2.0 compliant user info and can also validate the token |
