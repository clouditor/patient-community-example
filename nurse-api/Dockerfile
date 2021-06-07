FROM openjdk:15-jdk

EXPOSE 8081:8081

RUN mkdir /nurse-api
COPY ./ /nurse-api
WORKDIR /nurse-api

CMD ["./gradlew", "bootRun"]