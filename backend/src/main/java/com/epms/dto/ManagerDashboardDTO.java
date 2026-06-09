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
public class ManagerDashboardDTO {
    private Long teamMembersCount;
    private Long assignedProjectsCount;
    private Long pendingReviewsCount;
    private Double teamAttendanceToday; // Present percentage for today
    private List<EmployeeDTO> teamMembers;
    private List<ProjectDTO> projects;
}
