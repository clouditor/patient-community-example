package auth

import (
	"gorm.io/gorm"
)

const RolePatient uint8 = 0
const RoleNurse uint8 = 1
const RoleResearcher uint8 = 2

type User struct {
	gorm.Model

	Username  string `gorm:"unique"`
	Role      uint8
	FirstName string
	LastName  string
	Password  string
}
