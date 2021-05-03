package io.clouditor.examples.patient_community.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  public enum Role {
    PATIENT,
    NURSE,
    RESEARCHER
  }

  String username;

  String firstName;

  String lastName;

  /** Do NOT return the password in the JSON representation / REST API. */
  @JsonIgnore String password;

  Role role;

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
