package com.zrun.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

public class TrainingPlanDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "Plan name is required")
        private String name;
        
        @NotNull(message = "Race type is required")
        private String raceType;  // standard or custom
        
        private String raceDistance;  // For standard races
        
        private Double customDistance;  // For custom races
        
        @NotNull(message = "Target goal is required")
        private String targetGoal;  // Completion, Personal Best, or Qualification Time
        
        @NotNull(message = "Distance in kilometers is required")
        @Positive(message = "Distance must be positive")
        private Double distanceInKm;
        
        private String planLengthType;  // startDate or endDate
        
        // Update date format pattern to handle ISO format with timezone information
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]", shape = JsonFormat.Shape.STRING)
        private LocalDateTime trainingStartDate;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]", shape = JsonFormat.Shape.STRING)
        private LocalDateTime trainingEndDate;
        
        @NotNull(message = "Plan length is required")
        @Min(value = 1, message = "Plan length must be at least 1 week")
        private Integer planLength;
        
        @NotNull(message = "Training frequency is required")
        @Min(value = 1, message = "Must train at least 1 day per week")
        @Max(value = 7, message = "Cannot train more than 7 days per week")
        private Integer trainingFrequency;
        
        private TargetTimeDto targetTime;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String name;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
        private LocalDateTime startDate;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
        private LocalDateTime endDate;
        
        private double distanceKm;
        private String targetGoal;
        private TargetTimeDto targetTime;
        private int trainingFrequency;
        private List<WorkoutDto> workouts;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
        private LocalDateTime createdAt;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
        private LocalDateTime updatedAt;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TargetTimeDto {
        @Min(value = 0, message = "Hours cannot be negative")
        @Max(value = 99, message = "Hours cannot exceed 99")
        private Integer hours;
        
        @Min(value = 0, message = "Minutes cannot be negative")
        @Max(value = 59, message = "Minutes must be between 0-59")
        private Integer minutes;
        
        @Min(value = 0, message = "Seconds cannot be negative")
        @Max(value = 59, message = "Seconds must be between 0-59")
        private Integer seconds;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkoutDto {
        private String id;
        private String type;
        private String description;
        private Double distanceKm;
        private Integer durationMinutes;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
        private LocalDateTime scheduledDate;
        
        private Boolean completed;
    }
}