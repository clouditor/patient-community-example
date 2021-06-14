FROM golang:1.16 as builder

WORKDIR /go/src/app
COPY . .

RUN go get -d -v ./...
RUN go install -v ./...
RUN CGO_ENABLED=0 go build cmd/auth-service/auth-service.go

FROM alpine:latest
COPY --from=builder /go/src/app/auth-service .
CMD [ "./auth-service" ]