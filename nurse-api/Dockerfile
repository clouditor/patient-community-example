FROM openjdk:15-jdk as builder

RUN mkdir /nurse-api
COPY ./ /nurse-api
WORKDIR /nurse-api
RUN ./gradlew build 

FROM openjdk:15-jdk
COPY --from=builder /nurse-api/build/libs/nurse-api-boot.jar /
WORKDIR /

EXPOSE 8081:8081

ENTRYPOINT ["java","-jar","/nurse-api-boot.jar"]