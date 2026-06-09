package com.epms.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDashboardDTO {
    private Long assignedProjectsCount;
    private String attendanceStatus; // "CHECKED_IN", "CHECKED_OUT", "ABSENT", "NOT_MARKED"
    private Double performanceScore; // Average rating score
    private Long upcomingReviews; // Placeholder count or dynamic
    private List<ProjectDTO> projects;
    private List<PerformanceReviewDTO> recentReviews;
}
