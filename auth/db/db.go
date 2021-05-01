package db

import (
	"fmt"

	"github.com/oxisto/go-httputil/argon2"
	"github.com/rs/zerolog/log"
	"github.com/sethvargo/go-password/password"
	"gorm.io/driver/postgres"
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

func Init(useInMemory bool) (err error) {
	// used to play around standalone and for unit tests
	if useInMemory {
		// use a in-memory DB
		if db, err = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{}); err != nil {
			return fmt.Errorf("db sqlite connect: %w", err)
		}
	} else {
		dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5432 sslmode=disable"

		// otherwise connect to a postgres DB on localhost
		if db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{}); err != nil {
			return fmt.Errorf("db postgres connect: %w", err)
		}
	}

	// Migrate the schema
	err = db.AutoMigrate(&User{})
	if err != nil {
		return
	}

	// check, if there are no users
	var count int64
	err = db.Find(&User{}).Count(&count).Error

	if count == 0 {
		return createInitialAdmin()
	}

	return err
}

func Get() *gorm.DB {
	return db
}

func createInitialAdmin() (err error) {
	var (
		initialPassword string
		passwordBytes   []byte
	)

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
