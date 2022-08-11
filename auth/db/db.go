package db

import (
	"auth"
	"fmt"
	"os"
	"time"

	"github.com/oxisto/go-httputil/argon2"
	"github.com/rs/zerolog/log"
	"github.com/sethvargo/go-password/password"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func EnvOrDefault(env string, def string) string {
	if s, isSet := os.LookupEnv(env); isSet {
		return s
	} else {
		return def
	}
}

func Init(useInMemory bool) (err error) {
	// used to play around standalone and for unit tests
	if useInMemory {
		// use a in-memory DB
		if db, err = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{}); err != nil {
			return fmt.Errorf("db sqlite connect: %w", err)
		}
	} else {
		host := EnvOrDefault("AUTH_POSTGRES_HOST", "localhost")
		user := EnvOrDefault("AUTH_POSTGRES_USER", "postgres")
		password := EnvOrDefault("AUTH_POSTGRES_PASSWORD", "postgres")
		dbname := EnvOrDefault("AUTH_POSTGRES_DB", "postgres")

		dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=5432 sslmode=disable",
			host,
			user,
			password,
			dbname,
		)

		//Retry needed, if Postgres DB is not ready
		for i := 0; i < 5; i++ {

			if db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{}); err != nil {
				log.Err(err).Msg("error opening db session")
				log.Info().Msg("retry after error during DB init")
				time.Sleep(1 * time.Second)
				continue
			} else {
				break
			}
		}

		if err != nil {
			return fmt.Errorf("db postgres connect: %w", err)
		}

	}

	// Migrate the schema
	err = db.AutoMigrate(&auth.User{})
	if err != nil {
		return err
	}

	// check, if there are no users
	var count int64
	err = db.Find(&auth.User{}).Count(&count).Error

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
		initialPassword         string
		initialUsername         string
		initialFirstName        string
		initialLastName         string
		initialPatientPassword  string
		initialPatientUsername  string
		initialPatientFirstName string
		initialPatientLastName  string
		passwordBytes           []byte
		patientPasswordBytes    []byte
	)

	initialUsername = "NurseRatched"
	initialFirstName = "Nurse"
	initialLastName = "Ratched"
	initialPatientUsername = "PatientZero"
	initialPatientFirstName = "Patient"
	initialPatientLastName = "Zero"

	initialPassword, err = password.GenerateIfNotInEnv("AUTH_DEFAULT_PASSWORD", 16, 2, 0, false, true)
	if err != nil {
		return fmt.Errorf("password generate: %w", err)
	}

	initialPatientPassword, err = password.GenerateIfNotInEnv("AUTH_DEFAULT_PASSWORD", 16, 2, 0, false, true)
	if err != nil {
		return fmt.Errorf("password generate: %w", err)
	}

	passwordBytes, err = argon2.GenerateFromPassword([]byte(initialPassword))
	if err != nil {
		return fmt.Errorf("hashing: %w", err)
	}

	patientPasswordBytes, err = argon2.GenerateFromPassword([]byte(initialPatientPassword))
	if err != nil {
		return fmt.Errorf("hashing: %w", err)
	}

	// Create the initial admin (nurse) user
	err = db.Create(&auth.User{
		Username:  initialUsername,
		FirstName: initialFirstName,
		LastName:  initialLastName,
		Password:  string(passwordBytes),
		Role:      auth.RoleNurse}).Error

	if err != nil {
		return fmt.Errorf("db: %w", err)
	}

	err = db.Create(&auth.User{
		Username:  initialPatientUsername,
		FirstName: initialPatientFirstName,
		LastName:  initialPatientLastName,
		Password:  string(patientPasswordBytes),
		Role:      auth.RolePatient}).Error

	if err != nil {
		return fmt.Errorf("db: %w", err)
	}

	// Print out our initial password on the console
	log.Info().Msgf("Created initial admin user (%s) with password: %s\n", initialUsername, initialPassword)
	log.Info().Msgf("Created initial patient user (%s) with password: %s\n", initialPatientUsername, initialPatientPassword)

	return nil
}
