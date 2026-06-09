package com.epms.config;

import com.epms.entity.Employee;
import com.epms.entity.Role;
import com.epms.entity.User;
import com.epms.repository.EmployeeRepository;
import com.epms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("Seeding database with default user roles...");

            // 1. Create Admin
            User adminUser = User.builder()
                    .email("admin@epms.com")
                    .password(passwordEncoder.encode("admin"))
                    .role(Role.ADMIN)
                    .build();
            adminUser = userRepository.save(adminUser);

            Employee adminEmployee = Employee.builder()
                    .user(adminUser)
                    .name("System Admin")
                    .email("admin@epms.com")
                    .department("Human Resources")
                    .designation("Admin Principal")
                    .joiningDate(LocalDate.of(2024, 1, 1))
                    .contactNumber("+1 555-0100")
                    .build();
            employeeRepository.save(adminEmployee);

            // 2. Create Manager
            User managerUser = User.builder()
                    .email("manager@epms.com")
                    .password(passwordEncoder.encode("manager"))
                    .role(Role.MANAGER)
                    .build();
            managerUser = userRepository.save(managerUser);

            Employee managerEmployee = Employee.builder()
                    .user(managerUser)
                    .name("Jane Doe")
                    .email("manager@epms.com")
                    .department("Engineering")
                    .designation("Engineering Manager")
                    .joiningDate(LocalDate.of(2024, 6, 1))
                    .contactNumber("+1 555-0200")
                    .build();
            managerEmployee = employeeRepository.save(managerEmployee);

            // 3. Create Employee 1 (John)
            User employeeUser1 = User.builder()
                    .email("employee@epms.com")
                    .password(passwordEncoder.encode("employee"))
                    .role(Role.EMPLOYEE)
                    .build();
            employeeUser1 = userRepository.save(employeeUser1);

            Employee employee1 = Employee.builder()
                    .user(employeeUser1)
                    .name("John Smith")
                    .email("employee@epms.com")
                    .department("Engineering")
                    .designation("Software Engineer")
                    .joiningDate(LocalDate.of(2025, 1, 15))
                    .contactNumber("+1 555-0301")
                    .manager(managerEmployee)
                    .build();
            employeeRepository.save(employee1);

            // 4. Create Employee 2 (Alice)
            User employeeUser2 = User.builder()
                    .email("alice@epms.com")
                    .password(passwordEncoder.encode("alice"))
                    .role(Role.EMPLOYEE)
                    .build();
            employeeUser2 = userRepository.save(employeeUser2);

            Employee employee2 = Employee.builder()
                    .user(employeeUser2)
                    .name("Alice Johnson")
                    .email("alice@epms.com")
                    .department("Engineering")
                    .designation("QA Engineer")
                    .joiningDate(LocalDate.of(2025, 2, 1))
                    .contactNumber("+1 555-0302")
                    .manager(managerEmployee)
                    .build();
            employeeRepository.save(employee2);

            System.out.println("Database seeding completed.");
        }
    }
}
