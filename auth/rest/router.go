package rest

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/oxisto/go-httputil/auth"
)

func NewRouter() *gin.Engine {
	options := auth.DefaultOptions
	options.JWTKeySupplier = func(token *jwt.Token) (interface{}, error) {
		return []byte(JwtSecretKey), nil
	}
	//options.JWTClaims = &model.APIClaims{}
	options.TokenExtractor = auth.ExtractFromFirstAvailable(
		auth.ExtractTokenFromCookie("token"),
		auth.ExtractTokenFromHeader)

	handler := auth.NewHandler(options)

	r := gin.Default()

	r.POST("/auth/login", Login)

	g := r.Group("/auth/userinfo")
	g.Use(handler.AuthRequired)
	g.POST("", UserInfo)

	return r
}
