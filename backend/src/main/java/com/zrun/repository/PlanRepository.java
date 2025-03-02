package com.zrun.repository;

import com.zrun.model.Plan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanRepository extends MongoRepository<Plan, String> {
    // Find all plans for a specific user
    List<Plan> findByUserId(String userId);

    // Find a specific plan for a user
    Optional<Plan> findByIdAndUserId(String id, String userId);

    // Find plans by status
    List<Plan> findByStatus(String status);

    // Find active plans for a user
    List<Plan> findByUserIdAndEnabledTrue(String userId);

    // Count plans by user
    long countByUserId(String userId);
}