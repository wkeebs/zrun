package com.zrun.service;

import com.zrun.model.User;
import com.zrun.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserInitializationService {
    private static final Logger logger = LoggerFactory.getLogger(UserInitializationService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @PostConstruct
    public void logInitialUsers() {
        List<User> users = userRepository.findAll();
        logger.info("Application Startup - Total Users Found: {}", users.size());
        
        // Log details of each user
        users.forEach(user -> {
            logger.info("User - ID: {}, Username: {}, Email: {}", 
                user.getId(), user.getName(), user.getEmail());
        });
        
        // Optional: If no users exist, you might want to create some default users
        if (users.isEmpty()) {
            createDefaultUsers();
        }
    }
    
    private void createDefaultUsers() {
        User adminUser = new User("admin", "admin@zrun.com");
        User defaultUser = new User("user", "user@zrun.com");
        
        userRepository.saveAll(List.of(adminUser, defaultUser));
        
        logger.info("Created default users as no users were found");
    }
}