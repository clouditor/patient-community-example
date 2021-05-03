package io.clouditor.examples.patient_community.persistence;

import io.clouditor.examples.patient_community.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {

  User findByUsername(String username);

  User findById(long id);
}
