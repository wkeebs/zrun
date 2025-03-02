package com.zrun.service;

import com.zrun.dto.request.RegistrationRequest;
import com.zrun.exception.UserAlreadyExistsException;
import com.zrun.model.Role;
import com.zrun.model.User;
import com.zrun.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public User registerUser(RegistrationRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already registered: " + request.getEmail());
        }
        
        // Create new user with encoded password
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .roles(Collections.singletonList(Role.ROLE_USER))
                .enabled(true)
                .build();
                
        // Save and return the new user
        User savedUser = userRepository.save(user);
        log.info("Successfully registered new user: {}", savedUser.getEmail());
        return savedUser;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}