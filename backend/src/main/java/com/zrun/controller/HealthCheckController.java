package com.zrun.controller;

import com.zrun.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthCheckController {
    private static final Logger logger = LoggerFactory.getLogger(HealthCheckController.class);
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> healthInfo = new HashMap<>();
        
        try {
            // Application status
            healthInfo.put("status", "UP");
            healthInfo.put("timestamp", LocalDateTime.now().toString());
            
            // System information
            healthInfo.put("javaVersion", System.getProperty("java.version"));
            healthInfo.put("osName", System.getProperty("os.name"));
            
            // Database connectivity check
            long userCount = userRepository.count();
            healthInfo.put("databaseStatus", "CONNECTED");
            // healthInfo.put("totalUsers", userCount);
            
            // Memory information
            Runtime runtime = Runtime.getRuntime();
            healthInfo.put("memoryUsed", runtime.totalMemory() - runtime.freeMemory());
            healthInfo.put("memoryMax", runtime.maxMemory());
            
            logger.info("Health check performed successfully");
            return ResponseEntity.ok(healthInfo);
        } catch (Exception e) {
            logger.error("Health check failed", e);
            
            healthInfo.put("status", "DOWN");
            healthInfo.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(healthInfo);
        }
    }

    @GetMapping("/detailed")
    public ResponseEntity<Map<String, Object>> detailedHealthCheck() {
        Map<String, Object> healthInfo = new HashMap<>();
        
        try {
            // All previous checks, plus more detailed information
            healthInfo.put("status", "UP");
            healthInfo.put("timestamp", LocalDateTime.now().toString());
            
            // System details
            healthInfo.put("javaVersion", System.getProperty("java.version"));
            healthInfo.put("javaVendor", System.getProperty("java.vendor"));
            healthInfo.put("osName", System.getProperty("os.name"));
            healthInfo.put("osVersion", System.getProperty("os.version"));
            
            // Database checks
            long userCount = userRepository.count();
            healthInfo.put("databaseStatus", "CONNECTED");
            healthInfo.put("totalUsers", userCount);
            
            // Memory details
            Runtime runtime = Runtime.getRuntime();
            healthInfo.put("memoryTotal", runtime.totalMemory());
            healthInfo.put("memoryFree", runtime.freeMemory());
            healthInfo.put("memoryUsed", runtime.totalMemory() - runtime.freeMemory());
            healthInfo.put("memoryMax", runtime.maxMemory());
            
            // Thread information
            ThreadGroup threadGroup = Thread.currentThread().getThreadGroup();
            healthInfo.put("activeThreads", threadGroup.activeCount());
            
            logger.info("Detailed health check performed successfully");
            return ResponseEntity.ok(healthInfo);
        } catch (Exception e) {
            logger.error("Detailed health check failed", e);
            
            healthInfo.put("status", "DOWN");
            healthInfo.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(healthInfo);
        }
    }
}