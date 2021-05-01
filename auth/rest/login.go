package rest

import (
	"auth/db"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/oxisto/go-httputil/argon2"
	"github.com/oxisto/go-httputil/auth"
	"gorm.io/gorm"
)

type LoginRequest struct {
	Username string
	Password string
}

type ErrorResponse struct {
	Error string
}

func NewErrorResponse(msg string) *ErrorResponse {
	return &ErrorResponse{msg}
}

// IssueToken issues a JWT token for use of the API
func IssueToken(sub string, expiry time.Time) (token string, err error) {
	key := []byte(jwtSecretKey)
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256,
		&jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24 * 30).Unix(),
			Subject:   sub,
		},
	)

	token, err = claims.SignedString(key)
	return
}

func Login(c *gin.Context) {
	var (
		request LoginRequest
		err     error
	)

	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user db.User

	err = db.Get().Where("username = ?", request.Username).First(&user).Error

	// do NOT return 404 here; we should not differentiate between user
	// not found and invalid password for security reasons
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusUnauthorized, NewErrorResponse("invalid credentials"))
		return
	} else if err != nil {
		panic(err)
	}

	err = argon2.CompareHashAndPassword([]byte(user.Password), []byte(request.Password))

	if errors.Is(err, argon2.ErrMismatchedHashAndPassword) {
		c.JSON(http.StatusUnauthorized, NewErrorResponse("invalid credentials"))
		return
	} else if err != nil {
		panic(err)
	}

	// tokens expire in 1 day
	expiry := time.Now().Add(time.Hour * 24)

	// issue an authentication token for our own API
	token, err := IssueToken(strconv.FormatInt(int64(user.ID), 10), expiry)
	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{"access_token": token})
}

func UserInfo(c *gin.Context) {
	var (
		ID  uint64
		err error
	)
	// it seems to be called anyway, so check for auth
	claims := c.Value(auth.ClaimsContext).(*jwt.StandardClaims)

	if ID, err = strconv.ParseUint(claims.Subject, 10, 64); err != nil {
		panic(err)
	}

	var user db.User

	err = db.Get().Find(&user, ID).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, NewErrorResponse("user not found"))
		return
	} else if err != nil {
		panic(err)
	}

	// do not return password
	user.Password = ""

	c.JSON(http.StatusOK, user)
}
