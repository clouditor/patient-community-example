#!/bin/bash
if test "$#" -lt 1; then
    echo "./start.sh [service ...]"
else
    if [ "$1" = "all" ]; then
        SERVICES="postgres mongo nurse-api frontend phr-manager auth"
    else
        SERVICES=$*
    fi

    echo $SERVICES

    if [[ "${SERVICES[@]}" =~ "postgres" ]]; then
        docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres
    fi

    if [[ "${SERVICES[@]}" =~ "mongo" ]]; then
        docker run -d -p 27017:27017 mongo
    fi

    if [[ "${SERVICES[@]}" =~ "nurse-api" ]]; then
        pushd nurse-api
            ./gradlew installDist
            build/install/nurse-api/bin/nurse-api &
        popd
    fi

    if [[ "${SERVICES[@]}" =~ "frontend" ]]; then
        pushd frontend
            yarn install
            yarn start &
        popd
    fi

    if [[ "${SERVICES[@]}" =~ "phr-manager" ]]; then
        pushd phr-manager
            ./app.py &
        popd
    fi

    if [[ "${SERVICES[@]}" =~ "auth" ]]; then
        pushd auth
            go build cmd/auth-service/auth-service.go
            AUTH_USE_REAL_DB=1 ./auth-service &
        popd
    fi
fi
