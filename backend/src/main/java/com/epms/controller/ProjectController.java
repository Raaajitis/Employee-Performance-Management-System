package com.epms.controller;

import com.epms.dto.ProjectDTO;
import com.epms.security.UserPrincipal;
import com.epms.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO dto) {
        return ResponseEntity.ok(projectService.createProject(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @RequestBody ProjectDTO dto) {
        return ResponseEntity.ok(projectService.updateProject(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Project deleted successfully.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-managed-projects")
    public ResponseEntity<List<ProjectDTO>> getMyManagedProjects(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(projectService.getProjectsByManager(currentUser.getId()));
    }

    @GetMapping("/my-assigned-projects")
    public ResponseEntity<List<ProjectDTO>> getMyAssignedProjects(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(projectService.getProjectsByEmployee(currentUser.getId()));
    }
}
