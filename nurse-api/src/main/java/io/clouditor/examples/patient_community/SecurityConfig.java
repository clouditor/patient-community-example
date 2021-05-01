package io.clouditor.examples.patient_community;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  private final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    var defaultAuthenticationEntryPoint = new BearerTokenAuthenticationEntryPoint();

    http.cors()
        .and()
        .authorizeRequests()
        .antMatchers(HttpMethod.GET, "/api/**")
        .hasAnyAuthority()
        .antMatchers(HttpMethod.POST, "/api/**")
        .hasAnyAuthority()
        .anyRequest()
        .authenticated()
        .and()
        .oauth2ResourceServer()
        .jwt()
        .and()
        .authenticationEntryPoint(
            (request, response, authException) -> {

              // this basically just logs the exception
              logger.error(authException.getMessage());

              defaultAuthenticationEntryPoint.commence(request, response, authException);
            });
  }

  @Bean
  JwtDecoder jwtDecoder(OAuth2ResourceServerProperties properties) {
    var jwtDecoder = NimbusJwtDecoder.withJwkSetUri(properties.getJwt().getJwkSetUri()).build();
    // jwtDecoder.setClaimSetConverter(new OrganizationSubClaimAdapter());

    return jwtDecoder;
  }
}
