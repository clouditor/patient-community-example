package rest

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-contrib/logger"
	"github.com/gin-gonic/gin"
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
		return []byte(jwtSecretKey), nil
	}
	//options.JWTClaims = &model.APIClaims{}
	options.TokenExtractor = auth.ExtractFromFirstAvailable(
		auth.ExtractTokenFromCookie("token"),
		auth.ExtractTokenFromHeader)

	handler := auth.NewHandler(options)

	//gin.SetMode(gin.ReleaseMode)

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(logger.SetLogger())

	r.POST("/auth/login", Login)
	r.Use(handler.AuthRequired).POST("/auth/userinfo", UserInfo)

	return r
}
