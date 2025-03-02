package com.zrun.controller;

import com.zrun.model.Plan;
import com.zrun.service.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PlanController {
    private final PlanService planService;

    /**
     * Create a new plan
     */
    @PostMapping
    public ResponseEntity<Plan> createPlan(@RequestBody Plan plan) {
        Plan createdPlan = planService.createPlan(plan);
        return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
    }

    /**
     * Get all plans for a user
     */
    @GetMapping
    public ResponseEntity<List<Plan>> getUserPlans(@RequestParam String userId) {
        List<Plan> plans = planService.getPlansByUser(userId);
        return ResponseEntity.ok(plans);
    }

    /**
     * Get a specific plan by ID
     */
    @GetMapping("/{planId}")
    public ResponseEntity<Plan> getPlan(
        @PathVariable String planId, 
        @RequestParam String userId
    ) {
        return planService.getPlanByIdAndUser(planId, userId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update an existing plan
     */
    @PutMapping("/{planId}")
    public ResponseEntity<Plan> updatePlan(
        @PathVariable String planId, 
        @RequestBody Plan plan
    ) {
        plan.setId(planId);
        Plan updatedPlan = planService.updatePlan(plan);
        return ResponseEntity.ok(updatedPlan);
    }

    /**
     * Delete a plan
     */
    @DeleteMapping("/{planId}")
    public ResponseEntity<Void> deletePlan(
        @PathVariable String planId, 
        @RequestParam String userId
    ) {
        planService.deletePlan(planId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Update plan status
     */
    @PatchMapping("/{planId}/status")
    public ResponseEntity<Plan> updatePlanStatus(
        @PathVariable String planId, 
        @RequestParam String userId,
        @RequestParam String status
    ) {
        Plan updatedPlan = planService.updatePlanStatus(planId, userId, status);
        return ResponseEntity.ok(updatedPlan);
    }

    /**
     * Get count of plans for a user
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getPlanCount(@RequestParam String userId) {
        long count = planService.countPlansByUser(userId);
        return ResponseEntity.ok(count);
    }
}