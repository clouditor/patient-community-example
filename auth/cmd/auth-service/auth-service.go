package main

import (
	"auth/rest"
	"net/http"

	log "github.com/sirupsen/logrus"
)

func main() {
	err := http.ListenAndServe(":8080", rest.NewRouter())

	log.Errorf("An error occured: %v", err)
}
