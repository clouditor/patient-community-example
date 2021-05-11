module auth

go 1.16

replace github.com/sethvargo/go-password => github.com/oxisto/go-password v0.2.1-0.20210501151719-2d0677627a51

require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/gin-contrib/logger v0.0.3
	github.com/gin-gonic/gin v1.7.1
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.1 // indirect
	github.com/oxisto/go-httputil v1.0.0
	github.com/rs/zerolog v1.21.0
	github.com/sethvargo/go-password v0.2.1-0.20210501151719-2d0677627a51
	gorm.io/driver/postgres v1.1.0
	gorm.io/driver/sqlite v1.1.4
	gorm.io/gorm v1.21.9
)
