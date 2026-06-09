package com.epms.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDTO {
    private Long id;
    private String name;
    private String email;
    private String department;
    private String designation;
    private LocalDate joiningDate;
    private String contactNumber;
    private String profilePicture;
    private Long managerId;
    private String managerName;
    private String role;
}
