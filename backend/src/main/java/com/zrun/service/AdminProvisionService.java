package com.zrun.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.zrun.model.User;
import com.zrun.repository.UserRepository;
import com.zrun.model.Role;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminProvisionService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${zrun.admin.email}")
    private String adminEmail;

    @Value("${zrun.admin.password}")
    private String adminPassword;

    @Value("${zrun.admin.name}")
    private String adminName;

    @EventListener(ApplicationReadyEvent.class)
    public void provisionAdminUser() {
        // Check if admin user already exists
        if (userRepository.findByEmail(adminEmail).isPresent()) {
            log.info("Admin user already exists");
            return;
        }

        // Create admin user if it doesn't exist
        User adminUser = User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .name(adminName)
                .roles(List.of(Role.ROLE_ADMIN, Role.ROLE_USER))
                .enabled(true)
                .build();

        userRepository.save(adminUser);
        log.info("Admin user provisioned successfully");
    }
}