package io.clouditor.examples.patient_community;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NurseApp {

  public String getGreeting() {
    return "Hello World!";
  }

  public static void main(String[] args) {
    SpringApplication.run(NurseApp.class, args);
  }
}
