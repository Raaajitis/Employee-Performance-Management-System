package com.epms.service;

import com.epms.dto.EmployeeDTO;
import com.epms.dto.ProjectDTO;
import com.epms.entity.Employee;
import com.epms.entity.Project;
import com.epms.entity.ProjectPriority;
import com.epms.entity.ProjectStatus;
import com.epms.repository.EmployeeRepository;
import com.epms.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProjectDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        return convertToDTO(project);
    }

    @Transactional
    public ProjectDTO createProject(ProjectDTO dto) {
        Employee manager = employeeRepository.findById(dto.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found with id: " + dto.getManagerId()));

        List<Employee> employees = new ArrayList<>();
        if (dto.getEmployeeIds() != null && !dto.getEmployeeIds().isEmpty()) {
            employees = employeeRepository.findAllById(dto.getEmployeeIds());
        }

        Project project = Project.builder()
                .projectName(dto.getProjectName())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(dto.getStatus() != null ? dto.getStatus() : ProjectStatus.NOT_STARTED)
                .priority(dto.getPriority() != null ? dto.getPriority() : ProjectPriority.MEDIUM)
                .manager(manager)
                .employees(employees)
                .build();

        Project saved = projectRepository.save(project);
        return convertToDTO(saved);
    }

    @Transactional
    public ProjectDTO updateProject(Long id, ProjectDTO dto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        project.setProjectName(dto.getProjectName());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setStatus(dto.getStatus());
        project.setPriority(dto.getPriority());

        if (dto.getManagerId() != null) {
            Employee manager = employeeRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Manager not found with id: " + dto.getManagerId()));
            project.setManager(manager);
        }

        if (dto.getEmployeeIds() != null) {
            List<Employee> employees = employeeRepository.findAllById(dto.getEmployeeIds());
            project.setEmployees(employees);
        } else {
            project.setEmployees(new ArrayList<>());
        }

        Project saved = projectRepository.save(project);
        return convertToDTO(saved);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        projectRepository.delete(project);
    }

    public List<ProjectDTO> getProjectsByManager(Long managerId) {
        return projectRepository.findByManagerId(managerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProjectDTO> getProjectsByEmployee(Long employeeId) {
        return projectRepository.findByEmployeeId(employeeId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProjectDTO convertToDTO(Project project) {
        if (project == null) return null;

        List<Long> employeeIds = project.getEmployees() != null ?
                project.getEmployees().stream().map(Employee::getId).collect(Collectors.toList()) :
                Collections.emptyList();

        List<EmployeeDTO> employees = project.getEmployees() != null ?
                project.getEmployees().stream().map(e -> EmployeeDTO.builder()
                        .id(e.getId())
                        .name(e.getName())
                        .email(e.getEmail())
                        .department(e.getDepartment())
                        .designation(e.getDesignation())
                        .build()
                ).collect(Collectors.toList()) :
                Collections.emptyList();

        return ProjectDTO.builder()
                .id(project.getId())
                .projectName(project.getProjectName())
                .description(project.getDescription())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .status(project.getStatus())
                .priority(project.getPriority())
                .managerId(project.getManager() != null ? project.getManager().getId() : null)
                .managerName(project.getManager() != null ? project.getManager().getName() : null)
                .employeeIds(employeeIds)
                .employees(employees)
                .build();
    }
}
