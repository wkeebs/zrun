package com.zrun.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "training_plans")
public class TrainingPlan {
    @Id
    private String id;
    private String userId;
    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private double distanceKm;
    private String targetGoal;
    private TargetTime targetTime;
    private int trainingFrequency;

    @Builder.Default
    private List<Workout> workouts = new ArrayList<>();    
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TargetTime {
        private int hours;
        private int minutes;
        private int seconds;
        
        // Convert to total seconds for calculations
        public int toTotalSeconds() {
            return hours * 3600 + minutes * 60 + seconds;
        }
        
        // Format as HH:MM:SS
        public String format() {
            return String.format("%02d:%02d:%02d", hours, minutes, seconds);
        }
    }
}