package com.epms.service;

import com.epms.dto.JwtResponse;
import com.epms.dto.LoginRequest;
import com.epms.dto.SignupRequest;
import com.epms.entity.Employee;
import com.epms.entity.Role;
import com.epms.entity.User;
import com.epms.repository.EmployeeRepository;
import com.epms.repository.UserRepository;
import com.epms.security.JwtTokenProvider;
import com.epms.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        // Load role string
        String roleName = userPrincipal.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                .findFirst()
                .orElse("EMPLOYEE");

        // Load employee name
        String name = employeeRepository.findById(userPrincipal.getId())
                .map(Employee::getName)
                .orElse(userPrincipal.getEmail());

        return new JwtResponse(jwt, userPrincipal.getId(), name, userPrincipal.getEmail(), roleName);
    }

    @Transactional
    public Employee signup(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email address already in use.");
        }

        // 1. Create User credentials
        User user = User.builder()
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .role(signupRequest.getRole() != null ? signupRequest.getRole() : Role.EMPLOYEE)
                .build();

        user = userRepository.save(user);

        // 2. Create Employee profile
        Employee.EmployeeBuilder employeeBuilder = Employee.builder()
                .user(user)
                .name(signupRequest.getName())
                .email(signupRequest.getEmail())
                .department(signupRequest.getDepartment())
                .designation(signupRequest.getDesignation())
                .joiningDate(signupRequest.getJoiningDate())
                .contactNumber(signupRequest.getContactNumber())
                .profilePicture(signupRequest.getProfilePicture());

        if (signupRequest.getManagerId() != null) {
            Optional<Employee> managerOpt = employeeRepository.findById(signupRequest.getManagerId());
            managerOpt.ifPresent(employeeBuilder::manager);
        }

        Employee employee = employeeBuilder.build();
        return employeeRepository.save(employee);
    }
}
