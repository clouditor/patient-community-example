package io.clouditor.examples.patient_community.rest;

import io.clouditor.examples.patient_community.model.User;
import io.clouditor.examples.patient_community.persistence.UserRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController()
@RequestMapping("/api/v1/users")
public class UserController {

  // TODO: do actual authentication

  @Autowired UserRepository repository;

  @GetMapping
  public List<User> listUsers() {
    var users = new ArrayList<User>();
    repository.findAll().forEach(users::add);

    return users;
  }

  @PostMapping
  public User createUser(@RequestBody CreateUserRequest request) {
    // TODO: check, if there is any validation framework in spring?
    if (request.username == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username must not be empty");
    }

    var encoder = new Argon2PasswordEncoder(16, 32, 2, 64 * 1024, 3);

    var user = new User();
    user.setUsername(request.username);
    user.setFirstName(request.firstName);
    user.setLastName(request.lastName);

    user.setPassword(encoder.encode(request.password));

    user.setRole(request.role);

    // check if user already exists
    if (repository.findByUsername(request.username) != null) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists");
    }

    repository.save(user);

    return user;
  }
}
