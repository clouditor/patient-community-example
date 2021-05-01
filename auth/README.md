# Authentication Service

This represents the *authentication* micro-service. It offers a simple REST based API with the following endpoints.

| URL      | Method |  Description                  |
| -------- | ------ | ----------------------------- |
| `/auth/login`  | POST   | User login and token creation |
| `/auth/userinfo` | POST | Retrieves OAuth2.0 compliant user info and can also validate the token |

## Usage

By default, a random password is generated, otherwise a default password for the initial admin user can be specified using the environment variable `AUTH_DEFAULT_PASSWORD`.

```
AUTH_DEFAULT_PASSWORD=myverysecretpassword ./auth-service
```

Example login with the admin user.

```
curl -d '{"Username": "admin", "password": "myverysecretpassword"}' -XPOST -v localhost:8080/auth/login
export ACCESS_TOKEN=...
curl -H "Authorization: Bearer $ACCESS_TOKEN" -XPOST -v localhost:8080/auth/userinfo
```

## Database Support

By default, an internal sqlite database is used for testing. However, for the full application to work, a real
database shared with other components is needed. Currently, an postgres DB at localhost is expected.

```
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres
export AUTH_USE_REAL_DB=1 ./auth-service
```
