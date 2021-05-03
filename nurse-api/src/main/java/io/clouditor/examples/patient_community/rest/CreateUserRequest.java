package io.clouditor.examples.patient_community.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.clouditor.examples.patient_community.model.User;

public class CreateUserRequest {

  @JsonProperty String username;

  @JsonProperty String firstName;

  @JsonProperty String lastName;

  @JsonProperty String password;

  @JsonProperty User.Role role;
}
