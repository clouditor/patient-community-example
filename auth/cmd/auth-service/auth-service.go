package main

import (
	"auth/db"
	"auth/rest"
	"net/http"
	"os"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	var err error

	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

	// human friendly output
	log.Logger = log.Output(
		zerolog.ConsoleWriter{
			TimeFormat: time.RFC822,
			Out:        os.Stderr,
			NoColor:    false,
		},
	)

	if err = db.Init(); err != nil {
		log.Err(err).Msg("An error occured during DB init")
	}

	err = http.ListenAndServe(":8080", rest.NewRouter())
	log.Err(err).Msg("An error occured")
}
