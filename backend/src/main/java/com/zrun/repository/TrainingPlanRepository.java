package com.zrun.repository;

import com.zrun.model.TrainingPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingPlanRepository extends MongoRepository<TrainingPlan, String> {
    
    /**
     * Find all training plans for a specific user
     * 
     * @param userId The ID of the user
     * @return List of training plans
     */
    List<TrainingPlan> findByUserId(String userId);
    
    /**
     * Find a specific training plan by ID for a specific user
     * 
     * @param id The ID of the training plan
     * @param userId The ID of the user
     * @return The training plan if found and belongs to the user
     */
    Optional<TrainingPlan> findByIdAndUserId(String id, String userId);
    
    /**
     * Check if a training plan exists and belongs to a specific user
     * 
     * @param id The ID of the training plan
     * @param userId The ID of the user
     * @return True if the plan exists and belongs to the user
     */
    boolean existsByIdAndUserId(String id, String userId);
    
    /**
     * Delete all training plans for a specific user
     * 
     * @param userId The ID of the user
     */
    void deleteByUserId(String userId);
}