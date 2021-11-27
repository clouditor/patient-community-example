package io.clouditor.examples.patient_community.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @JsonProperty
  private Long id;

  public enum Role {
    PATIENT,
    NURSE,
    RESEARCHER
  }

  @Column(unique = true)
  String username;

  @Column(name = "first_name")
  @JsonProperty
  // Policy non-compliance threat (disproportionate collection/processing/storage)
  String firstName;

  @Column(name = "last_name")
  @JsonProperty
  // Policy non-compliance threat (disproportionate collection/processing/storage)
  String lastName;

  @Column(name = "deleted_at")
  Date deletedAt;

  @Column(name = "updated_at")
  Date updatedAt;

  @Column(name = "created_at")
  Date createdAt;

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

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }
}
