package io.clouditor.examples.patient_community.rest;

import io.clouditor.examples.patient_community.model.User;
import io.clouditor.examples.patient_community.persistence.UsersRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController()
@RequestMapping("/api/v1/users")
public class UsersController {

  // TODO: do actual authentication

  @Autowired UsersRepository repository;

  @GetMapping
  public List<User> listUsers() {
    var users = new ArrayList<User>();
    repository.findAll().forEach(users::add);

    return users;
  }

  @PostMapping
  public User createUser(@RequestBody CreateUserRequest request) {
    var user = new User();
    user.setUsername(request.username);
    // TODO: hash it
    user.setPassword(request.password);
    user.setRole(request.role);

    // check if user already exists
    if (repository.findByUsername(request.username) != null) {
      throw new ResponseStatusException(HttpStatus.CONFLICT);
    }

    repository.save(user);

    return user;
  }
}
