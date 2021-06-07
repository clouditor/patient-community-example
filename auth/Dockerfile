FROM golang:1.16

WORKDIR /go/src/app
COPY . .

RUN go get -d -v ./...
RUN go install -v ./...
RUN go build cmd/auth-service/auth-service.go

ENV AUTH_USE_REAL_DB 1
ENV AUTH_DEFAULT_PASSWORD myverysecretpassword
ENV AUTH_POSTGRES_HOST=postgres

CMD ["auth-service"]