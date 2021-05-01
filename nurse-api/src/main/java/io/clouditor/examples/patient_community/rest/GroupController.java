package io.clouditor.examples.patient_community.rest;

import io.clouditor.examples.patient_community.model.Group;
import java.util.Collections;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/groups")
public class GroupController {

  @GetMapping("/")
  public List<Group> listGroups() {

    var group = new Group();
    group.setName("some group");

    return Collections.singletonList(group);
  }
}
