package com.zrun.controller;

import com.zrun.dto.request.LoginRequest;
import com.zrun.dto.request.RegistrationRequest;
import com.zrun.dto.response.AuthResponse;
import com.zrun.model.Role;
import com.zrun.model.User;
import com.zrun.security.JwtTokenProvider;
import com.zrun.security.UserPrincipal;
import com.zrun.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j // Adds logging capabilities
@RestController // Marks this as a REST controller
@RequestMapping("/api/auth") // Base URL path for all endpoints in this controller
@RequiredArgsConstructor // Generates constructor for final fields (dependency injection)
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Log the login attempt (email only, never log passwords!)
            log.info("Login attempt for user: {}", loginRequest.getEmail());

            // Create authentication token from the request
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword());

            // Attempt to authenticate the user
            Authentication authentication = authenticationManager.authenticate(authToken);

            // If we get here, authentication was successful
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            String jwt = tokenProvider.generateToken(authentication);

            // Get user details from the authentication object
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            // Extract user roles
            List<Role> roles = userPrincipal.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .map(Role::fromAuthority) // Convert String to Role enum
                    .collect(Collectors.toList());

            // Create and return the response
            AuthResponse response = AuthResponse.builder()
                    .token(jwt)
                    .email(userPrincipal.getEmail())
                    .roles(roles)
                    .build();

            log.info("User {} successfully authenticated", loginRequest.getEmail());
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            // Log failed attempt (but don't expose too much information)
            log.warn("Failed login attempt for user: {}", loginRequest.getEmail());
            return ResponseEntity
                    .badRequest()
                    .body("Invalid email or password");
        } catch (Exception e) {
            // Log unexpected errors
            log.error("Unexpected error during login for user: {}", loginRequest.getEmail(), e);
            return ResponseEntity
                    .internalServerError()
                    .body("An unexpected error occurred");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegistrationRequest request) {
        // Register the user
        User user = userService.registerUser(request);

        // Generate JWT token
        String jwt = tokenProvider.generateToken(user);

        // Create and return authentication response
        AuthResponse response = AuthResponse.builder()
                .token(jwt)
                .email(user.getEmail())
                .roles(user.getRoles())
                .build();

        return ResponseEntity.ok(response);
    }
}