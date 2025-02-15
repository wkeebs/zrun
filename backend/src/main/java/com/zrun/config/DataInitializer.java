package com.zrun.config;

import com.zrun.model.User;
import com.zrun.model.Role;
import com.zrun.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminConfig adminConfig;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setEmail(adminConfig.getEmail());
            admin.setPassword(passwordEncoder.encode(adminConfig.getPassword()));
            admin.setName(adminConfig.getName());
            admin.setRoles(Set.of(Role.ROLE_ADMIN, Role.ROLE_USER));
            
            userRepository.save(admin);
            
            System.out.println("Created admin user: " + adminConfig.getEmail());
        }
    }
}