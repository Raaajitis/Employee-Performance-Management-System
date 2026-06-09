package com.epms.service;

import com.epms.dto.EmployeeDTO;
import com.epms.dto.SignupRequest;
import com.epms.entity.Employee;
import com.epms.entity.Role;
import com.epms.entity.User;
import com.epms.repository.EmployeeRepository;
import com.epms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        return convertToDTO(employee);
    }

    @Transactional
    public EmployeeDTO createEmployee(SignupRequest request) {
        Employee employee = authService.signup(request);
        return convertToDTO(employee);
    }

    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        employee.setName(dto.getName());
        employee.setDepartment(dto.getDepartment());
        employee.setDesignation(dto.getDesignation());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setContactNumber(dto.getContactNumber());
        
        if (dto.getProfilePicture() != null) {
            employee.setProfilePicture(dto.getProfilePicture());
        }

        // Update manager relationship
        if (dto.getManagerId() != null) {
            if (dto.getManagerId().equals(id)) {
                throw new RuntimeException("An employee cannot be their own manager.");
            }
            Employee manager = employeeRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Manager not found with id: " + dto.getManagerId()));
            
            if (manager.getUser().getRole() != Role.MANAGER && manager.getUser().getRole() != Role.ADMIN) {
                throw new RuntimeException("Assigned manager must have MANAGER or ADMIN role.");
            }
            employee.setManager(manager);
        } else {
            employee.setManager(null);
        }

        // Update user credentials role if specified
        if (dto.getRole() != null && employee.getUser() != null) {
            User user = employee.getUser();
            user.setRole(Role.valueOf(dto.getRole().toUpperCase()));
            userRepository.save(user);
        }

        Employee updated = employeeRepository.save(employee);
        return convertToDTO(updated);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        
        // Remove manager links first
        List<Employee> reportees = employeeRepository.findByManagerId(id);
        for (Employee r : reportees) {
            r.setManager(null);
            employeeRepository.save(r);
        }

        employeeRepository.delete(employee);
        userRepository.deleteById(id);
    }

    public List<EmployeeDTO> searchEmployees(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllEmployees();
        }
        return employeeRepository.searchEmployees(query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EmployeeDTO> getTeamByManagerId(Long managerId) {
        return employeeRepository.findByManagerId(managerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EmployeeDTO> getEmployeesByRole(Role role) {
        return employeeRepository.findByRole(role).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeDTO assignManager(Long employeeId, Long managerId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (managerId != null) {
            Employee manager = employeeRepository.findById(managerId)
                    .orElseThrow(() -> new RuntimeException("Manager not found"));
            employee.setManager(manager);
        } else {
            employee.setManager(null);
        }

        Employee updated = employeeRepository.save(employee);
        return convertToDTO(updated);
    }

    public EmployeeDTO convertToDTO(Employee employee) {
        if (employee == null) return null;
        return EmployeeDTO.builder()
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .department(employee.getDepartment())
                .designation(employee.getDesignation())
                .joiningDate(employee.getJoiningDate())
                .contactNumber(employee.getContactNumber())
                .profilePicture(employee.getProfilePicture())
                .managerId(employee.getManager() != null ? employee.getManager().getId() : null)
                .managerName(employee.getManager() != null ? employee.getManager().getName() : null)
                .role(employee.getUser() != null ? employee.getUser().getRole().name() : null)
                .build();
    }
}
