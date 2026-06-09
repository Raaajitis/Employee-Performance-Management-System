package com.epms.controller;

import com.epms.dto.JwtResponse;
import com.epms.dto.LoginRequest;
import com.epms.dto.SignupRequest;
import com.epms.entity.Employee;
import com.epms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Invalid email or password.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        try {
            Employee employee = authService.signup(signupRequest);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully.");
            response.put("employeeId", employee.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Map<String, String> response = new HashMap<>();
        if (email == null || email.trim().isEmpty()) {
            response.put("message", "Email is required.");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Simulating the password reset link dispatch
        response.put("message", "A password reset link has been sent to " + email + " (Simulation).");
        return ResponseEntity.ok(response);
    }
}
