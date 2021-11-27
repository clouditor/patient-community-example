package rest

import (
	"auth"
	"auth/db"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/oxisto/go-httputil/argon2"
	hauth "github.com/oxisto/go-httputil/auth"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type LoginRequest struct {
	Username string
	Password string
}

type ErrorResponse struct {
	Error string
}

var privateKey *ecdsa.PrivateKey

type ExtendedClaims struct {
	*jwt.StandardClaims
	Scope string `json:"scope"`
}

func init() {
	var err error

	c := elliptic.P256()

	// generate key
	privateKey, err = ecdsa.GenerateKey(c, rand.Reader)
	if err != nil {
		log.Err(err).Msgf("Could not generate key")
		return
	}

	if !c.IsOnCurve(privateKey.PublicKey.X, privateKey.PublicKey.Y) {
		log.Err(err).Msgf("Public key is invalid")
	}
}

func NewErrorResponse(msg string) *ErrorResponse {
	return &ErrorResponse{msg}
}

// issueToken issues a JWT token for use of the API
func issueToken(sub string, scope string, expiry time.Time) (token string, err error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodES256,
		/*&jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24 * 30).Unix(),
			Subject:   sub,
		},*/
		ExtendedClaims{&jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24 * 30).Unix(),
			Subject:   sub,
		},
			scope,
		},
	)

	token, err = claims.SignedString(privateKey)
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

	var user auth.User

	err = db.Get().Where("username = ?", request.Username).First(&user).Error

	// Logging threat
	log.Info().Msgf("Got login request from user %s", user)

	// Detectability threat
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, NewErrorResponse("User not found"))
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

	// set the scope according to the role name
	var scope string = ""
	if user.Role == 0 {
		scope = "patient"
	} else if user.Role == 1 {
		scope = "nurse"
	} else if user.Role == 2 {
		scope = "researcher"
	}

	var sub string = strconv.FormatInt(int64(user.ID), 10)

	// issue an authentication token for our own API
	token, err := issueToken(sub, scope, expiry)
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
	claims := c.Value(hauth.ClaimsContext).(*jwt.StandardClaims)

	if ID, err = strconv.ParseUint(claims.Subject, 10, 64); err != nil {
		panic(err)
	}

	var user auth.User

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

func JwkCredentials(c *gin.Context) {
	publicKey := privateKey.PublicKey

	c.JSON(http.StatusOK, gin.H{"keys": []gin.H{
		{
			"kty": "EC",
			"use": "sig",
			"alg": "ES256",
			"crv": "P-256",
			"x":   base64.RawURLEncoding.EncodeToString(publicKey.X.Bytes()),
			"y":   base64.RawURLEncoding.EncodeToString(publicKey.Y.Bytes()),
		},
	}})
}
