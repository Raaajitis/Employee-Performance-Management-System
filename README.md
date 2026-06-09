# Employee Performance Management System (EPMS)

## Project Overview

The Employee Performance Management System (EPMS) is a full-stack web application designed to streamline employee administration, project management, attendance tracking, and performance evaluation within an organization.

The system provides a centralized platform where administrators, managers, and employees can interact according to their assigned roles and responsibilities. EPMS improves organizational efficiency by digitizing employee records, monitoring attendance, managing projects, and conducting structured performance reviews.

---

# Objectives

The primary objectives of EPMS are:

* Centralize employee information management.
* Enable role-based access control.
* Simplify project assignment and tracking.
* Automate attendance monitoring.
* Facilitate employee performance evaluation.
* Provide actionable insights through dashboards and analytics.

---

# Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router

## Backend

* Spring Boot
* Spring Security
* JWT Authentication
* Hibernate / JPA

## Database

* MySQL

## Build Tools

* Maven
* npm

---

# System Architecture

EPMS follows a Three-Tier Architecture:

## 1. Presentation Layer

The presentation layer provides user interfaces for Admins, Managers, and Employees.

Responsibilities:

* Display dashboards
* Collect user input
* Show reports and analytics
* Manage forms and interactions

Technology:

* React.js
* Tailwind CSS

---

## 2. Business Logic Layer

The business layer processes application logic and enforces business rules.

Responsibilities:

* User authentication
* Role authorization
* Attendance processing
* Project assignment
* Performance calculations
* Data validation

Technology:

* Spring Boot
* Spring Security
* JWT

---

## 3. Data Layer

The data layer stores and manages all persistent information.

Responsibilities:

* User records
* Employee profiles
* Attendance logs
* Projects
* Performance reviews

Technology:

* MySQL

---

# User Roles

## Admin

Permissions:

* Manage employees
* Manage managers
* Create projects
* Assign employees to projects
* View attendance reports
* View organizational analytics
* Monitor performance reviews

---

## Manager

Permissions:

* View team members
* Manage assigned projects
* View team attendance
* Conduct employee performance reviews

---

## Employee

Permissions:

* View profile
* View assigned projects
* Mark attendance
* View performance reviews
* Track performance score

---

# Functional Modules

## Authentication Module

Features:

* Login
* Signup
* Forgot Password
* JWT Authentication
* Role-Based Access Control

Workflow:

1. User submits credentials.
2. System validates credentials.
3. JWT token is generated.
4. User is redirected to the appropriate dashboard.

---

## Dashboard Module

### Admin Dashboard

Displays:

* Total Employees
* Active Projects
* Attendance Percentage
* Pending Reviews
* Recent Activities

### Manager Dashboard

Displays:

* Team Members
* Assigned Projects
* Attendance Summary
* Pending Reviews

### Employee Dashboard

Displays:

* Assigned Projects
* Attendance Status
* Performance Score
* Upcoming Reviews

---

## Employee Management Module

Admin Functions:

* Add Employee
* Edit Employee
* Delete Employee
* Search Employee
* Assign Manager

Employee Profile Fields:

* Name
* Email
* Department
* Designation
* Joining Date
* Contact Number
* Profile Picture

---

## Project Management Module

Features:

* Create Project
* Update Project
* Assign Manager
* Assign Employees
* Track Project Status

Project Status:

* Not Started
* In Progress
* Completed
* On Hold

Project Fields:

* Project Name
* Description
* Start Date
* End Date
* Priority
* Status

---

## Attendance Management Module

Employee Functions:

* Check In
* Check Out
* View Attendance

Manager Functions:

* View Team Attendance

Admin Functions:

* View Organization Attendance

Features:

* Attendance Calendar
* Monthly Reports
* Attendance Percentage Calculation

---

## Performance Review Module

Managers evaluate employees based on:

* Technical Skills
* Communication
* Teamwork
* Problem Solving
* Leadership

Rating Scale:
1–5 Stars

Performance Score Formula:

Performance Score =
(Technical Skills + Communication + Teamwork + Problem Solving + Leadership) / 5

Employees can view historical reviews and performance trends.

---

# Database Design

Core Entities:

## User

Stores authentication credentials and role information.

## Employee

Stores employee profile details.

## Project

Stores project information and assignments.

## Attendance

Stores daily attendance records.

## Performance Review

Stores manager evaluations.

---

# Security Features

* JWT Authentication
* Password Encryption using BCrypt
* Role-Based Authorization
* Protected API Endpoints
* Secure Session Handling

---

# Application Workflow

1. User registers or logs in.
2. System authenticates the user.
3. User is redirected based on role.
4. Admin manages employees and projects.
5. Employees mark attendance daily.
6. Managers supervise team activities.
7. Managers submit performance reviews.
8. System calculates performance scores.
9. Dashboards display real-time organizational data.

---

# Future Enhancements

* Leave Management System
* Payroll Integration
* Notification Service
* Email Alerts
* Audit Logs
* AI-Based Performance Analytics
* Mobile Application Support
* Advanced Reporting and Export Features

---

# Conclusion

The Employee Performance Management System provides a comprehensive solution for managing organizational workforce operations. By integrating employee management, attendance tracking, project monitoring, and performance evaluation into a single platform, EPMS enhances transparency, accountability, and operational efficiency.
