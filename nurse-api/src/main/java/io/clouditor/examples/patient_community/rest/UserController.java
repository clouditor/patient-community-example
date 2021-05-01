package io.clouditor.examples.patient_community.rest;

import io.clouditor.examples.patient_community.model.User;
import io.clouditor.examples.patient_community.persistence.UserRepository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
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

  // TODO: extract into extra class
  private static void validate() {
    // Well, technically not necessary to validate a JWT against its issuer
    // because they are self-validated, but we need to simulate a data flow
    // from the portal to the authentication service.
    final String uri = "http://localhost:8080/auth/validate";
    var restTemplate = new RestTemplate();

    var headers = new HttpHeaders();
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
    headers.set("Authorization", "Bearer");

    var entity = new HttpEntity<String>(headers);

    var response = restTemplate.exchange(uri, HttpMethod.GET, entity, User.class);

    System.out.println(response);
  }
}
