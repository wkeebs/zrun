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
    private String name;
    private Double totalDistance;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String planType;
    private String status;

    @Builder.Default
    private boolean enabled = true;
}