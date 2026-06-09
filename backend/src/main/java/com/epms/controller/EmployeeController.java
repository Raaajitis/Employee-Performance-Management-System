package com.epms.controller;

import com.epms.dto.EmployeeDTO;
import com.epms.dto.SignupRequest;
import com.epms.entity.Role;
import com.epms.security.UserPrincipal;
import com.epms.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(employeeService.createEmployee(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Employee profile and credentials deleted successfully.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EmployeeDTO>> searchEmployees(@RequestParam("query") String query) {
        return ResponseEntity.ok(employeeService.searchEmployees(query));
    }

    @GetMapping("/managers")
    public ResponseEntity<List<EmployeeDTO>> getAllManagers() {
        // Find users who are either MANAGER or ADMIN (who can act as managers)
        List<EmployeeDTO> managers = employeeService.getEmployeesByRole(Role.MANAGER);
        // Include admins as possible managers too
        managers.addAll(employeeService.getEmployeesByRole(Role.ADMIN));
        return ResponseEntity.ok(managers);
    }

    @GetMapping("/team")
    public ResponseEntity<List<EmployeeDTO>> getMyTeam(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(employeeService.getTeamByManagerId(currentUser.getId()));
    }

    @PutMapping("/{id}/assign-manager")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeDTO> assignManager(
            @PathVariable Long id, 
            @RequestParam(value = "managerId", required = false) Long managerId) {
        return ResponseEntity.ok(employeeService.assignManager(id, managerId));
    }
}
