package com.zrun.controller;

import com.zrun.dto.TrainingPlanDto;
import com.zrun.service.TrainingPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
@Slf4j
public class TrainingPlanController {
    
    private final TrainingPlanService planService;
    
    /**
     * Create a new training plan
     */
    @PostMapping
    public ResponseEntity<TrainingPlanDto.Response> createPlan(
            @Valid @RequestBody TrainingPlanDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("Creating new training plan for user: {}", userDetails.getUsername());
        TrainingPlanDto.Response createdPlan = planService.createPlan(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
    }
    
    /**
     * Get all plans for the current user
     */
    @GetMapping
    public ResponseEntity<List<TrainingPlanDto.Response>> getUserPlans(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("Fetching plans for user: {}", userDetails.getUsername());
        List<TrainingPlanDto.Response> plans = planService.getUserPlans(userDetails.getUsername());
        return ResponseEntity.ok(plans);
    }
    
    /**
     * Get a specific plan by ID
     */
    @GetMapping("/{planId}")
    public ResponseEntity<TrainingPlanDto.Response> getPlanById(
            @PathVariable String planId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("Fetching plan with ID: {} for user: {}", planId, userDetails.getUsername());
        TrainingPlanDto.Response plan = planService.getPlanById(planId, userDetails.getUsername());
        return ResponseEntity.ok(plan);
    }
    
    /**
     * Update a training plan
     */
    @PutMapping("/{planId}")
    public ResponseEntity<TrainingPlanDto.Response> updatePlan(
            @PathVariable String planId,
            @Valid @RequestBody TrainingPlanDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("Updating plan with ID: {} for user: {}", planId, userDetails.getUsername());
        TrainingPlanDto.Response updatedPlan = planService.updatePlan(planId, request, userDetails.getUsername());
        return ResponseEntity.ok(updatedPlan);
    }
    
    /**
     * Delete a training plan
     */
    @DeleteMapping("/{planId}")
    public ResponseEntity<Void> deletePlan(
            @PathVariable String planId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("Deleting plan with ID: {} for user: {}", planId, userDetails.getUsername());
        planService.deletePlan(planId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}