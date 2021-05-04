#!/bin/bash

docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres

pushd nurse-api
./gradlew installDist
build/install/nurse-api/bin/nurse-api &
popd

pushd frontend
yarn install
yarn start &
popd

pushd auth
go build cmd/auth-service/auth-service.go
AUTH_USE_REAL_DB=1 ./auth-service &
popd
