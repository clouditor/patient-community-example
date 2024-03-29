package io.clouditor.examples.patient_community.rest;

import io.clouditor.examples.patient_community.model.Group;
import io.clouditor.examples.patient_community.persistence.GroupRepository;
import io.clouditor.examples.patient_community.persistence.UserRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/groups")
public class GroupController {

  @Autowired GroupRepository groupRepository;
  @Autowired UserRepository userRepository;

  @GetMapping
  public List<Group> listGroups() {
    var groups = new ArrayList<Group>();
    groupRepository.findAll().forEach(groups::add);

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
    if (groupRepository.findByName(request.name) != null) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Group already exists");
    }

    groupRepository.save(group);

    return group;
  }

  @PostMapping(path = "/members")
  public Group addUser(@RequestBody AddGroupMember request) {
    // TODO: check, if there is any validation framework in spring?
    if (request.groupId == null || request.userId == null) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Either group id or user id was null");
    }

    // find group
    var optionalGroup = groupRepository.findById(request.groupId);

    if (optionalGroup.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Group does not exist");
    }

    // find user
    var optionalUser = userRepository.findById(request.userId);

    if (optionalUser.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User does not exist");
    }

    var group = optionalGroup.get();

    // add the user
    group.addUser(optionalUser.get());

    // save it
    groupRepository.save(group);

    return group;
  }
}
