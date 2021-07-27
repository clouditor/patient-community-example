module auth

go 1.16

require (
	github.com/gin-contrib/logger v0.0.3
	github.com/gin-gonic/gin v1.7.1
	github.com/golang-jwt/jwt v3.2.1+incompatible
	github.com/oxisto/go-httputil v1.0.3
	github.com/rs/zerolog v1.22.0
	github.com/sethvargo/go-password v0.2.1-0.20210501151719-2d0677627a51
	gorm.io/driver/postgres v1.1.0
	gorm.io/driver/sqlite v1.1.4
	gorm.io/gorm v1.21.9
)

replace github.com/sethvargo/go-password => github.com/oxisto/go-password v0.2.1-0.20210501151719-2d0677627a51
