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
public class AdminDashboardDTO {
    private Long totalEmployees;
    private Long activeProjects;
    private Double attendancePercentage;
    private Long pendingReviews;
    private List<String> recentActivities;
}
