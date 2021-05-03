package io.clouditor.examples.patient_community.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import javax.persistence.*;

/** A group contains patients with the same conditions */
@Entity
@Table(name = "groups")
public class Group {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @JsonProperty
  private Long id;

  @Column(unique = true)
  private String name;

  public void setName(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}
