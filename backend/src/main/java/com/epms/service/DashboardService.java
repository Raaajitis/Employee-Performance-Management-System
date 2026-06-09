package com.epms.service;

import com.epms.dto.*;
import com.epms.entity.Attendance;
import com.epms.entity.Employee;
import com.epms.entity.PerformanceReview;
import com.epms.entity.Project;
import com.epms.entity.ProjectStatus;
import com.epms.repository.AttendanceRepository;
import com.epms.repository.EmployeeRepository;
import com.epms.repository.PerformanceReviewRepository;
import com.epms.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private PerformanceReviewRepository reviewRepository;

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private ProjectService projectService;

    public AdminDashboardDTO getAdminDashboard() {
        long totalEmployees = employeeRepository.count();
        
        long activeProjects = projectRepository.findAll().stream()
                .filter(p -> p.getStatus() != ProjectStatus.COMPLETED)
                .count();

        double attendancePercent = attendanceService.getOrgAttendancePercentage();
        long pendingReviews = reviewService.getPendingReviewsCountAll();

        // Compile recent activity strings
        List<String> activities = new ArrayList<>();
        
        // 1. Recent attendance check-ins
        List<Attendance> recentAttendance = attendanceRepository.findAll().stream()
                .sorted((a1, a2) -> a2.getDate().compareTo(a1.getDate()))
                .limit(3)
                .collect(Collectors.toList());
        for (Attendance a : recentAttendance) {
            activities.add(String.format("Attendance: %s marked %s on %s", a.getEmployee().getName(), a.getStatus(), a.getDate()));
        }

        // 2. Recent projects
        List<Project> recentProjects = projectRepository.findAll().stream()
                .sorted((p1, p2) -> p2.getId().compareTo(p1.getId()))
                .limit(2)
                .collect(Collectors.toList());
        for (Project p : recentProjects) {
            activities.add(String.format("Project: '%s' added with status %s", p.getProjectName(), p.getStatus()));
        }

        // 3. Recent reviews
        List<PerformanceReview> recentReviews = reviewRepository.findAll().stream()
                .sorted((r1, r2) -> r2.getReviewDate().compareTo(r1.getReviewDate()))
                .limit(2)
                .collect(Collectors.toList());
        for (PerformanceReview r : recentReviews) {
            activities.add(String.format("Performance: %s reviewed %s (Score: %.2f)", r.getReviewer().getName(), r.getEmployee().getName(), r.getScore()));
        }

        if (activities.isEmpty()) {
            activities.add("No recent activity recorded.");
        }

        return AdminDashboardDTO.builder()
                .totalEmployees(totalEmployees)
                .activeProjects(activeProjects)
                .attendancePercentage(attendancePercent)
                .pendingReviews(pendingReviews)
                .recentActivities(activities)
                .build();
    }

    public ManagerDashboardDTO getManagerDashboard(Long managerId) {
        Employee manager = employeeRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        List<Employee> team = employeeRepository.findByManagerId(managerId);
        long teamMembersCount = team.size();

        List<Project> projects = projectRepository.findByManagerId(managerId);
        long assignedProjectsCount = projects.size();

        long pendingReviewsCount = reviewService.getPendingReviewsCountForManager(managerId);
        double teamAttendanceToday = attendanceService.getTeamAttendancePercentage(managerId);

        List<EmployeeDTO> teamDTOs = team.stream()
                .map(employeeService::convertToDTO)
                .collect(Collectors.toList());

        List<ProjectDTO> projectDTOs = projects.stream()
                .map(p -> ProjectDTO.builder()
                        .id(p.getId())
                        .projectName(p.getProjectName())
                        .description(p.getDescription())
                        .startDate(p.getStartDate())
                        .endDate(p.getEndDate())
                        .status(p.getStatus())
                        .priority(p.getPriority())
                        .build())
                .collect(Collectors.toList());

        return ManagerDashboardDTO.builder()
                .teamMembersCount(teamMembersCount)
                .assignedProjectsCount(assignedProjectsCount)
                .pendingReviewsCount(pendingReviewsCount)
                .teamAttendanceToday(teamAttendanceToday)
                .teamMembers(teamDTOs)
                .projects(projectDTOs)
                .build();
    }

    public EmployeeDashboardDTO getEmployeeDashboard(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<Project> projects = projectRepository.findByEmployeeId(employeeId);
        long assignedProjectsCount = projects.size();

        // Determine today's attendance status
        LocalDate today = LocalDate.now();
        Optional<Attendance> attendanceOpt = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);
        String attendanceStatus = "NOT_MARKED";
        if (attendanceOpt.isPresent()) {
            Attendance att = attendanceOpt.get();
            if (att.getCheckOutTime() != null) {
                attendanceStatus = "CHECKED_OUT";
            } else {
                attendanceStatus = "CHECKED_IN";
            }
        }

        double performanceScore = reviewService.getEmployeeAverageScore(employeeId);
        
        // Count reviews written for this employee
        List<PerformanceReview> reviews = reviewRepository.findByEmployeeId(employeeId);
        long upcomingReviews = reviews.isEmpty() ? 1L : 0L; // If never reviewed, show 1 pending review cycle

        List<ProjectDTO> projectDTOs = projects.stream()
                .map(p -> ProjectDTO.builder()
                        .id(p.getId())
                        .projectName(p.getProjectName())
                        .description(p.getDescription())
                        .startDate(p.getStartDate())
                        .endDate(p.getEndDate())
                        .status(p.getStatus())
                        .priority(p.getPriority())
                        .managerName(p.getManager() != null ? p.getManager().getName() : null)
                        .build())
                .collect(Collectors.toList());

        List<PerformanceReviewDTO> reviewDTOs = reviews.stream()
                .sorted((r1, r2) -> r2.getReviewDate().compareTo(r1.getReviewDate()))
                .limit(3)
                .map(reviewService::convertToDTO)
                .collect(Collectors.toList());

        return EmployeeDashboardDTO.builder()
                .assignedProjectsCount(assignedProjectsCount)
                .attendanceStatus(attendanceStatus)
                .performanceScore(performanceScore)
                .upcomingReviews(upcomingReviews)
                .projects(projectDTOs)
                .recentReviews(reviewDTOs)
                .build();
    }
}
