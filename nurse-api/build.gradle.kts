import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    application

	id("org.springframework.boot") version "2.4.4"
    id("com.diffplug.spotless") version "5.11.0"
	id("io.spring.dependency-management") version "1.0.11.RELEASE"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")

    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
    implementation("org.springframework.security.oauth:spring-security-oauth2:2.5.1.RELEASE")

    implementation("org.postgresql:postgresql:42.2.20")

    testImplementation("org.springframework.boot:spring-boot-starter-test")

    // Use JUnit Jupiter API for testing.
    testImplementation("org.junit.jupiter:junit-jupiter-api:5.7.1")

    // Use JUnit Jupiter Engine for testing.
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine")
}

tasks.withType<Jar> {
    enabled = true
}

tasks.withType<BootJar> {
    classifier = "boot"
}

tasks.withType<JavaCompile> {
    dependsOn(":spotlessApply")
}

application {
    mainClass.set("io.clouditor.examples.patient_community.NurseApp")
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11

    withSourcesJar()
    withJavadocJar()
}

tasks.test {
    useJUnitPlatform()
}

spotless {
    java {
        googleJavaFormat()
    }
}
