package io.clouditor.examples.patient_community.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Set;
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

  /** The members of this group. */
  @ManyToMany
  @JoinTable(
      name = "group_members",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "group_id"))
  @JsonProperty
  private Set<User> members;

  public void setName(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void addUser(User user) {
    this.members.add(user);
  }
}
