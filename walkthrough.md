# EPMS Portal Walkthrough & Credentials

We have successfully built and verified a full-stack, role-based Employee Performance Management System (EPMS). The backend Spring Boot server and React Vite frontend are fully functional and running locally.

## Work Accomplished

### 1. Database Schema (`MySQL`)
We created the `epms_db` schema in MySQL. When the application boots, tables are generated dynamically based on the Hibernate entity definitions:
- `users`: Standard login authentication records with email and roles.
- `employees`: Core workforce profile detail records, linked via a unidirectional `@OneToOne` mapsId relationship to `users`.
- `projects`: Operational projects with Manager-to-Employee mappings.
- `attendance`: Daily log-in and log-out times with `LATE`/`PRESENT` status metrics.
- `performance_reviews`: Appraisals containing skill ratings (1 to 5) and feedback remarks.

### 2. Backend Service Layers (`Spring Boot`)
- **JWT & Stateless Security**: Implemented JWT authorization filters utilizing HMAC-SHA512.
- **REST Resource Enpoints**:
  - `AuthController`: Handles login credentials checks and registrations.
  - `EmployeeController`: Handles manager assignments, profile detail overrides, and search.
  - `ProjectController`: Allocates employees and manager leads.
  - `AttendanceController`: Triggers daily check-in/out actions and compiles histories.
  - `ReviewController`: Calculates averages across tech, communication, teamwork, problem solving, and leadership categories.
  - `DashboardController`: Compiles specific dashboard statistics based on the request principal's role.

### 3. Frontend Architecture (`React + Tailwind CSS`)
- **Theme & Auth Contexts**: Supports light and dark style systems, persistence, and Axios request interceptions.
- **Visual Dashboards**:
  - **Admin**: Tracks company stats, charts attendance trends via Recharts, and shows recent logs.
  - **Manager**: Supervises assigned staff rosters and files evaluations.
  - **Employee**: Logs daily timestamps and reviews scorecards.

---

## Demo Accounts & Test Credentials

The database has been pre-populated with standard accounts to ease review. Open `http://localhost:5173/` in your browser to test:

| User Role | Email | Password | Mapped Name | Mapped Actions |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@epms.com` | `admin` | System Admin | Manage Employees/Projects, View Org Attendance |
| **Manager** | `manager@epms.com` | `manager` | Jane Doe | Manage Team Projects, Submit Reviews, View Team Attendance |
| **Employee** | `employee@epms.com` | `employee` | John Smith | Check-In/Out, View Assigned Projects, View Scorecard |
| **Employee** | `alice@epms.com` | `alice` | Alice Johnson | Check-In/Out, View Assigned Projects, View Scorecard |

---

## Verification & Validations

1. **Compilation**: Built successfully using `./mvnw clean compile`.
2. **Database Integrity**: Seeded and checked foreign key links programmatically.
3. **Frontend Server**: Vite server running locally at `http://localhost:5173/`.
4. **Backend Server**: Tomcat booted on port `8080` and listening for queries.
