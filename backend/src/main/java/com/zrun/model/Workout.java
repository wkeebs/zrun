package com.zrun.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents a workout within a training plan.
 * This class is used as an embedded document within the TrainingPlan document.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Workout {
    
    /**
     * Unique identifier for the workout
     */
    private String id;
    
    /**
     * Type of workout (e.g., "Easy Run", "Long Run", "Interval", "Tempo", "Rest")
     */
    private String type;
    
    /**
     * Detailed description of the workout
     */
    private String description;
    
    /**
     * Target distance in kilometers
     */
    private Double distanceKm;
    
    /**
     * Target duration in minutes
     */
    private Integer durationMinutes;
    
    /**
     * Target pace in seconds per kilometer
     */
    private Integer targetPaceSecPerKm;
    
    /**
     * Scheduled date and time for the workout
     */
    private LocalDateTime scheduledDate;
    
    /**
     * Indicates if the workout has been completed
     */
    private boolean completed;
    
    /**
     * Actual distance covered (if completed)
     */
    private Double actualDistanceKm;
    
    /**
     * Actual duration in minutes (if completed)
     */
    private Integer actualDurationMinutes;
    
    /**
     * User notes about the workout
     */
    private String notes;
    
    /**
     * Perceived effort level (1-10 scale)
     */
    private Integer perceivedEffort;
    
    /**
     * Date and time when the workout was completed
     */
    private LocalDateTime completedAt;
    
    /**
     * Optional external data ID (e.g., Strava activity ID)
     */
    private String externalDataId;
    
    /**
     * Calculated intensity score for the workout
     */
    private Double intensityScore;
    
    /**
     * Week number within the training plan
     */
    private Integer weekNumber;
    
    /**
     * Day number within the week
     */
    private Integer dayNumber;
    
    /**
     * Format the target pace as a string (MM:SS per km/mi)
     * 
     * @param useMetric true to display as min/km, false for min/mi
     * @return formatted pace string
     */
    public String formatTargetPace(boolean useMetric) {
        if (targetPaceSecPerKm == null) {
            return "-";
        }
        
        int paceSeconds = targetPaceSecPerKm;
        
        // Convert to min/mi if needed
        if (!useMetric) {
            // 1 km = 0.621371 miles, so multiply seconds/km by 0.621371 to get seconds/mi
            paceSeconds = (int) Math.round(paceSeconds * 0.621371);
        }
        
        int minutes = paceSeconds / 60;
        int seconds = paceSeconds % 60;
        
        return String.format("%d:%02d", minutes, seconds);
    }
    
    /**
     * Calculate and get the completion percentage of the workout
     * 
     * @return percentage from 0 to 100
     */
    public int getCompletionPercentage() {
        if (completed) {
            return 100;
        }
        
        if (actualDistanceKm != null && distanceKm != null && distanceKm > 0) {
            double percentage = (actualDistanceKm / distanceKm) * 100;
            return (int) Math.min(99, Math.round(percentage)); // Cap at 99% if not marked completed
        }
        
        return 0;
    }
}