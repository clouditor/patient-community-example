FROM openjdk:15-jdk as builder

COPY . .
COPY ./Docker/application.yml src/main/resources
RUN ./gradlew build 

FROM openjdk:15-jdk
COPY --from=builder /build/libs/nurse-api-boot.jar /

EXPOSE 8081

ENTRYPOINT ["java","-jar","/nurse-api-boot.jar"]