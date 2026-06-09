package com.epms.dto;

import com.epms.entity.Role;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private String department;
    private String designation;
    private LocalDate joiningDate;
    private String contactNumber;
    private String profilePicture;
    private Long managerId;
}
