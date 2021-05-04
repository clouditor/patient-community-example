package io.clouditor.examples.patient_community.persistence;

import io.clouditor.examples.patient_community.model.Group;
import io.clouditor.examples.patient_community.model.User;
import org.springframework.data.repository.CrudRepository;

public interface GroupRepository extends CrudRepository<Group, Long> {

  User findByName(String name);

  User findById(long id);
}
