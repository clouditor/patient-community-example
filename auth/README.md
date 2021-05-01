# Authentication Service

This represents the *authentication* micro-service. It offers a simple REST based API with the following endpoints.

| URL      | Method |  Description                  |
| -------- | ------ | ----------------------------- |
| `/auth/login`  | POST   | User login and token creation |
| `/auth/userinfo` | POST | Retrieves OAuth2.0 compliant user info and can also validate the token |

## Usage

```
curl -d '{"Username": "user", "password": "password"}' -XPOST -v localhost:8080/auth/login
export ACCESS_TOKEN=...
curl -H "Authorization: Bearer $ACCESS_TOKEN" -XPOST -v localhost:8080/auth/userinfo
```
