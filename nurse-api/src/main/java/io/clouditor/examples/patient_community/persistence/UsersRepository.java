package io.clouditor.examples.patient_community.persistence;

import io.clouditor.examples.patient_community.model.User;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface UsersRepository extends CrudRepository<User, Long> {

  List<User> findByUsername(String username);

  User findById(long id);
}
