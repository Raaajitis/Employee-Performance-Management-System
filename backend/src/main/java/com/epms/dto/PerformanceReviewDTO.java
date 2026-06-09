package com.epms.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceReviewDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long reviewerId;
    private String reviewerName;
    private Integer technicalSkills;
    private Integer communication;
    private Integer teamwork;
    private Integer problemSolving;
    private Integer leadership;
    private String comments;
    private Double score;
    private LocalDate reviewDate;
}
