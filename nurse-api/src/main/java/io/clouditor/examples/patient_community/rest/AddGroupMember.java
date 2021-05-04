package io.clouditor.examples.patient_community.rest;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AddGroupMember {

  @JsonProperty Long groupId;

  @JsonProperty Long userId;
}
