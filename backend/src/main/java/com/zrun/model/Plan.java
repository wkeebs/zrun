package com.zrun.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "plans")
public class Plan {
    @Id
    private String id;

    private String userId;
    private String raceType; // "standard" or "custom"

    // Goal and planning attributes
    private String targetGoal; // "Personal Best", "First Time Finisher", etc.
    private Integer trainingFrequency; // 3-6 days per week

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String planType; // Additional classification if needed
    private String status; // e.g., "DRAFT", "ACTIVE", "COMPLETED"

    @Builder.Default
    private boolean enabled = true;
}