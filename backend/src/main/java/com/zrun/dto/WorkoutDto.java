package com.zrun.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for Workout operations
 */
public class WorkoutDto {

    /**
     * Request DTO for creating a new workout
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "Workout type is required")
        private String type;
        
        private String description;
        
        @Min(value = 0, message = "Distance cannot be negative")
        private Double distanceKm;
        
        @Min(value = 0, message = "Duration cannot be negative")
        private Integer durationMinutes;
        
        private Integer targetPaceSecPerKm;
        
        @NotNull(message = "Scheduled date is required")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime scheduledDate;
        
        @NotNull(message = "Week number is required")
        @Min(value = 1, message = "Week number must be at least 1")
        private Integer weekNumber;
        
        @NotNull(message = "Day number is required")
        @Min(value = 1, message = "Day number must be at least 1")
        private Integer dayNumber;
    }
    
    /**
     * Request DTO for updating a workout completion status
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompleteRequest {
        @NotNull(message = "Completed status is required")
        private Boolean completed;
        
        private Double actualDistanceKm;
        
        private Integer actualDurationMinutes;
        
        private String notes;
        
        private Integer perceivedEffort;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime completedAt;
        
        private String externalDataId;
    }
    
    /**
     * Response DTO for workout data
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String type;
        private String description;
        private Double distanceKm;
        private Integer durationMinutes;
        private Integer targetPaceSecPerKm;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime scheduledDate;
        
        private boolean completed;
        private Double actualDistanceKm;
        private Integer actualDurationMinutes;
        private String notes;
        private Integer perceivedEffort;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime completedAt;
        
        private String externalDataId;
        private Double intensityScore;
        private Integer weekNumber;
        private Integer dayNumber;
        
        /**
         * Calculate and include completion percentage in response
         */
        public int getCompletionPercentage() {
            if (completed) {
                return 100;
            }
            
            if (actualDistanceKm != null && distanceKm != null && distanceKm > 0) {
                double percentage = (actualDistanceKm / distanceKm) * 100;
                return (int) Math.min(99, Math.round(percentage));  // Cap at 99% if not marked completed
            }
            
            return 0;
        }
    }
}