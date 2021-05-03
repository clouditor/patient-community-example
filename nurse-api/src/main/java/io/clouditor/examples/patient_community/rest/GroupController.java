package io.clouditor.examples.patient_community.rest;

import io.clouditor.examples.patient_community.model.Group;
import io.clouditor.examples.patient_community.persistence.GroupRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/groups")
public class GroupController {

  @Autowired GroupRepository repository;

  @GetMapping
  public List<Group> listGroups() {
    var groups = new ArrayList<Group>();
    repository.findAll().forEach(groups::add);

    return groups;
  }

  @PostMapping
  public Group createGroup(@RequestBody CreateGroupRequest request) {
    // TODO: check, if there is any validation framework in spring?
    if (request.name == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name must not be empty");
    }

    var group = new Group();
    group.setName(request.name);

    // check if group already exists
    if (repository.findByName(request.name) != null) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists");
    }

    repository.save(group);

    return group;
  }
}
