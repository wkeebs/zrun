package com.zrun.service;

import com.zrun.model.Plan;
import com.zrun.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlanService {
    private final PlanRepository planRepository;

    /**
     * Create a new training plan
     * @param plan Plan to be created
     * @return Created plan
     */
    public Plan createPlan(Plan plan) {
        // Set default values if not provided
        if (plan.getStartDate() == null) {
            plan.setStartDate(LocalDateTime.now());
        }
        
        // Ensure enabled is set
        plan.setEnabled(true);
        
        // Set default status if not provided
        if (plan.getStatus() == null) {
            plan.setStatus("CREATED");
        }

        return planRepository.save(plan);
    }

    /**
     * Update an existing plan
     * @param plan Plan to be updated
     * @return Updated plan
     */
    public Plan updatePlan(Plan plan) {
        // Ensure the plan exists
        if (plan.getId() == null) {
            throw new IllegalArgumentException("Plan ID must be provided for update");
        }

        return planRepository.save(plan);
    }

    /**
     * Retrieve a specific plan by ID and user ID
     * @param id Plan ID
     * @param userId User ID
     * @return Optional of Plan
     */
    public Optional<Plan> getPlanByIdAndUser(String id, String userId) {
        return planRepository.findByIdAndUserId(id, userId);
    }

    /**
     * Retrieve all plans for a user
     * @param userId User ID
     * @return List of Plans
     */
    public List<Plan> getPlansByUser(String userId) {
        return planRepository.findByUserId(userId);
    }

    /**
     * Retrieve active plans for a user
     * @param userId User ID
     * @return List of active Plans
     */
    public List<Plan> getActivePlansByUser(String userId) {
        return planRepository.findByUserIdAndEnabledTrue(userId);
    }

    /**
     * Delete a specific plan
     * @param id Plan ID
     * @param userId User ID
     */
    public void deletePlan(String id, String userId) {
        Plan plan = planRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found"));
        
        planRepository.delete(plan);
    }

    /**
     * Count plans for a user
     * @param userId User ID
     * @return Number of plans
     */
    public long countPlansByUser(String userId) {
        return planRepository.countByUserId(userId);
    }

    /**
     * Change plan status
     * @param id Plan ID
     * @param userId User ID
     * @param newStatus New status
     * @return Updated plan
     */
    public Plan updatePlanStatus(String id, String userId, String newStatus) {
        Plan plan = planRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found"));
        
        plan.setStatus(newStatus);
        return planRepository.save(plan);
    }
}