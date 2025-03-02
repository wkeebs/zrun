package com.zrun.service;

import com.zrun.dto.TrainingPlanDto;
import com.zrun.exception.ResourceNotFoundException;
import com.zrun.model.TrainingPlan;
import com.zrun.model.User;
import com.zrun.repository.TrainingPlanRepository;
import com.zrun.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Validated
@Slf4j
public class TrainingPlanService {

    private final TrainingPlanRepository planRepository;
    private final UserRepository userRepository;

    /**
     * Create a new training plan
     */
    public TrainingPlanDto.Response createPlan(@Valid TrainingPlanDto.CreateRequest request, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LocalDateTime now = LocalDateTime.now();

        // Ensure we have both start and end dates regardless of which was provided
        LocalDateTime startDate = request.getTrainingStartDate();
        LocalDateTime endDate = request.getTrainingEndDate();

        if (startDate == null && endDate != null) {
            // Calculate start date based on end date and plan length
            startDate = endDate.minusWeeks(request.getPlanLength());
        } else if (endDate == null && startDate != null) {
            // Calculate end date based on start date and plan length
            endDate = startDate.plusWeeks(request.getPlanLength());
        } else if (startDate == null && endDate == null) {
            // If neither is provided, use today as start date
            startDate = now;
            endDate = startDate.plusWeeks(request.getPlanLength());
        }

        // Create target time object if provided
        TrainingPlan.TargetTime targetTime = null;
        if (request.getTargetTime() != null) {
            targetTime = TrainingPlan.TargetTime.builder()
                    .hours(request.getTargetTime().getHours())
                    .minutes(request.getTargetTime().getMinutes())
                    .seconds(request.getTargetTime().getSeconds())
                    .build();
        }

        // Build the training plan entity
        TrainingPlan plan = TrainingPlan.builder()
                .userId(user.getId())
                .name(request.getName())
                .startDate(startDate)
                .endDate(endDate)
                .distanceKm(request.getDistanceInKm())
                .targetGoal(request.getTargetGoal())
                .targetTime(targetTime)
                .trainingFrequency(request.getTrainingFrequency())
                .workouts(new ArrayList<>()) // Explicitly initialize workouts list
                .createdAt(now)
                .updatedAt(now)
                .build();

        // TODO: Generate workouts based on plan parameters

        // Save the plan to the database
        TrainingPlan savedPlan = planRepository.save(plan);
        log.info("Created new training plan with ID: {} for user: {}", savedPlan.getId(), username);

        // Return the DTO response
        return mapToDto(savedPlan);
    }

    /**
     * Get all plans for a specific user
     */
    public List<TrainingPlanDto.Response> getUserPlans(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<TrainingPlan> plans = planRepository.findByUserId(user.getId());
        log.info("Found {} plans for user: {}", plans.size(), username);

        return plans.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific plan by ID for a user
     */
    public TrainingPlanDto.Response getPlanById(String planId, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TrainingPlan plan = planRepository.findByIdAndUserId(planId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found or access denied"));

        log.info("Found plan with ID: {} for user: {}", planId, username);
        return mapToDto(plan);
    }

    /**
     * Update an existing training plan
     */
    public TrainingPlanDto.Response updatePlan(String planId, @Valid TrainingPlanDto.CreateRequest request,
            String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TrainingPlan existingPlan = planRepository.findByIdAndUserId(planId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found or access denied"));

        // Update plan properties
        existingPlan.setName(request.getName());
        existingPlan.setDistanceKm(request.getDistanceInKm());
        existingPlan.setTargetGoal(request.getTargetGoal());
        existingPlan.setTrainingFrequency(request.getTrainingFrequency());
        existingPlan.setUpdatedAt(LocalDateTime.now());

        // Update dates if provided
        if (request.getTrainingStartDate() != null) {
            existingPlan.setStartDate(request.getTrainingStartDate());
            existingPlan.setEndDate(request.getTrainingStartDate().plusWeeks(request.getPlanLength()));
        } else if (request.getTrainingEndDate() != null) {
            existingPlan.setEndDate(request.getTrainingEndDate());
            existingPlan.setStartDate(request.getTrainingEndDate().minusWeeks(request.getPlanLength()));
        }

        // Update target time if provided
        if (request.getTargetTime() != null) {
            TrainingPlan.TargetTime targetTime = TrainingPlan.TargetTime.builder()
                    .hours(request.getTargetTime().getHours())
                    .minutes(request.getTargetTime().getMinutes())
                    .seconds(request.getTargetTime().getSeconds())
                    .build();
            existingPlan.setTargetTime(targetTime);
        } else {
            existingPlan.setTargetTime(null);
        }

        // TODO: Regenerate workouts based on updated parameters

        // Save the updated plan
        TrainingPlan updatedPlan = planRepository.save(existingPlan);
        log.info("Updated plan with ID: {} for user: {}", planId, username);

        return mapToDto(updatedPlan);
    }

    /**
     * Delete a training plan
     */
    public void deletePlan(String planId, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TrainingPlan plan = planRepository.findByIdAndUserId(planId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found or access denied"));

        planRepository.delete(plan);
        log.info("Deleted plan with ID: {} for user: {}", planId, username);
    }

    // The issue is in this method in TrainingPlanService.java

    /**
     * Map a TrainingPlan entity to a TrainingPlanDto.Response
     */
    private TrainingPlanDto.Response mapToDto(TrainingPlan plan) {
        // Map target time
        TrainingPlanDto.TargetTimeDto targetTimeDto = null;
        if (plan.getTargetTime() != null) {
            targetTimeDto = TrainingPlanDto.TargetTimeDto.builder()
                    .hours(plan.getTargetTime().getHours())
                    .minutes(plan.getTargetTime().getMinutes())
                    .seconds(plan.getTargetTime().getSeconds())
                    .build();
        }

        // Map workouts - Add null check before streaming
        List<TrainingPlanDto.WorkoutDto> workoutDtos = Collections.emptyList();
        if (plan.getWorkouts() != null) {
            workoutDtos = plan.getWorkouts().stream()
                    .map(workout -> TrainingPlanDto.WorkoutDto.builder()
                            .id(workout.getId())
                            .type(workout.getType())
                            .description(workout.getDescription())
                            .distanceKm(workout.getDistanceKm())
                            .durationMinutes(workout.getDurationMinutes())
                            .scheduledDate(workout.getScheduledDate())
                            .completed(workout.isCompleted())
                            .build())
                    .collect(Collectors.toList());
        }

        // Return the DTO
        return TrainingPlanDto.Response.builder()
                .id(plan.getId())
                .name(plan.getName())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .distanceKm(plan.getDistanceKm())
                .targetGoal(plan.getTargetGoal())
                .targetTime(targetTimeDto)
                .trainingFrequency(plan.getTrainingFrequency())
                .workouts(workoutDtos)
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();
    }
}