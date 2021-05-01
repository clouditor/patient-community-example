package db

import (
	"fmt"

	"github.com/oxisto/go-httputil/argon2"
	"github.com/rs/zerolog/log"
	"github.com/sethvargo/go-password/password"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model

	Username string
	Name     string
	Password string
}

var db *gorm.DB

func Init() (err error) {
	var (
		initialPassword string
		passwordBytes   []byte
	)

	// use a in-memory DB for now
	if db, err = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{}); err != nil {
		return fmt.Errorf("db connect: %w", err)
	}

	// Migrate the schema
	db.AutoMigrate(&User{})

	initialPassword, err = password.GenerateIfNotInEnv("AUTH_DEFAULT_PASSWORD", 16, 2, 0, false, true)
	if err != nil {
		return fmt.Errorf("password generate: %w", err)
	}

	passwordBytes, err = argon2.GenerateFromPassword([]byte(initialPassword))
	if err != nil {
		return fmt.Errorf("hashing: %w", err)
	}

	// Create the initial admin user
	db.Create(&User{Username: "admin", Password: string(passwordBytes)})

	if db.Error != nil {
		return fmt.Errorf("db: %w", err)
	}

	// Print out our initial password on the console
	log.Info().Msgf("Created initial admin user with password: %s\n", initialPassword)

	return nil
}

func Get() *gorm.DB {
	return db
}
