package rest

import (
	"github.com/gin-contrib/logger"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/oxisto/go-httputil/auth"
	"github.com/rs/zerolog/log"
	"github.com/sethvargo/go-password/password"
)

var jwtSecretKey string

func init() {
	var err error

	jwtSecretKey, err = password.GenerateIfNotInEnv("AUTH_JWT_SECRET_KEY", 16, 2, 0, false, true)
	if err != nil {
		log.Err(err).Msg("Could not set JWT secret key")
	}
}

func NewRouter() *gin.Engine {
	options := auth.DefaultOptions
	options.JWTKeySupplier = func(token *jwt.Token) (interface{}, error) {
		return privateKey.PublicKey, nil
	}
	options.JWTClaims = &ExtendedClaims{}
	options.TokenExtractor = auth.ExtractFromFirstAvailable(
		auth.ExtractTokenFromCookie("token"),
		auth.ExtractTokenFromHeader)

	handler := auth.NewHandler(options)

	//gin.SetMode(gin.ReleaseMode)

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(logger.SetLogger())

	r.POST("/auth/login", Login)
	r.GET("/auth/credentials", JwkCredentials)
	r.Use(handler.AuthRequired).GET("/auth/userinfo", UserInfo)

	return r
}
