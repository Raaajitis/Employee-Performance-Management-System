package com.epms.dto;

import com.epms.entity.ProjectPriority;
import com.epms.entity.ProjectStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDTO {
    private Long id;
    private String projectName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;
    private ProjectPriority priority;
    private Long managerId;
    private String managerName;
    private List<Long> employeeIds;
    private List<EmployeeDTO> employees;
}
