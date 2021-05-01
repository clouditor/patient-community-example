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

	_, useRealDb := os.LookupEnv("AUTH_USE_REAL_DB")

	if err = db.Init(!useRealDb); err != nil {
		log.Err(err).Msg("An error occured during DB init")
	}

	err = http.ListenAndServe(":8080", rest.NewRouter())
	log.Err(err).Msg("An error occured")
}
