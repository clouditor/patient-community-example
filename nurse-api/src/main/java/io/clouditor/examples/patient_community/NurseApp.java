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

  // TODO replace with application.yml (https://stackoverflow.com/a/32843504)
  /*@Bean
  public DataSource dataSource() {
    DriverManagerDataSource driver = new DriverManagerDataSource();
    driver.setDriverClassName("org.postgresql.Driver");
    driver.setUrl("jdbc:postgresql://localhost:5432/postgres");
    driver.setUsername("postgres");
    driver.setPassword("postgres");

    return driver;
  }*/
}
