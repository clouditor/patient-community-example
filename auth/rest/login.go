package rest

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/oxisto/go-httputil/auth"
)

const JwtSecretKey = "dfjsdfjklsdkjlfjklsdjklfjklsdfjkl"

type LoginRequest struct {
	Username string
	Password string
}

// IssueToken issues a JWT token for use of the API
func IssueToken(userID int64, expiry time.Time) (token string, err error) {
	key := []byte(JwtSecretKey)
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256,
		&jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24 * 30).Unix(),
			Subject:   strconv.FormatInt(userID, 10),
		},
	)

	token, err = claims.SignedString(key)
	return
}

func Login(c *gin.Context) {
	var userID int64 = 1

	// tokens expire in 1 day
	expiry := time.Now().Add(time.Hour * 24)

	// issue an authentication token for our own API
	token, err := IssueToken(userID, expiry)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "could not issue token"})
	}

	c.JSON(http.StatusOK, gin.H{"access_token": token})
}

func UserInfo(c *gin.Context) {
	// it seems to be called anyway, so check for auth
	claims := c.Value(auth.ClaimsContext).(*jwt.StandardClaims)

	fmt.Printf("%+v\n", claims)
}
