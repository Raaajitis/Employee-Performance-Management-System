package com.epms.service;

import com.epms.dto.AttendanceDTO;
import com.epms.entity.Attendance;
import com.epms.entity.AttendanceStatus;
import com.epms.entity.Employee;
import com.epms.repository.AttendanceRepository;
import com.epms.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    private static final LocalTime LATE_THRESHOLD = LocalTime.of(9, 30); // 9:30 AM

    @Transactional
    public AttendanceDTO checkIn(Long employeeId) {
        LocalDate today = LocalDate.now();
        
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);
        if (existing.isPresent()) {
            throw new RuntimeException("Already checked in for today.");
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));

        LocalTime now = LocalTime.now();
        AttendanceStatus status = now.isAfter(LATE_THRESHOLD) ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .date(today)
                .checkInTime(now)
                .status(status)
                .build();

        Attendance saved = attendanceRepository.save(attendance);
        return convertToDTO(saved);
    }

    @Transactional
    public AttendanceDTO checkOut(Long employeeId) {
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new RuntimeException("No check-in record found for today. Please check in first."));

        if (attendance.getCheckOutTime() != null) {
            throw new RuntimeException("Already checked out for today.");
        }

        attendance.setCheckOutTime(LocalTime.now());
        Attendance saved = attendanceRepository.save(attendance);
        return convertToDTO(saved);
    }

    public List<AttendanceDTO> getEmployeeAttendance(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getEmployeeAttendanceInPeriod(Long employeeId, LocalDate start, LocalDate end) {
        return attendanceRepository.findByEmployeeIdAndDateBetween(employeeId, start, end).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getTeamAttendanceToday(Long managerId) {
        return attendanceRepository.findTeamAttendanceByDate(managerId, LocalDate.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getTeamAttendanceInPeriod(Long managerId, LocalDate start, LocalDate end) {
        return attendanceRepository.findTeamAttendanceInPeriod(managerId, start, end).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getOrgAttendanceToday() {
        return attendanceRepository.findByDate(LocalDate.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getOrgAttendanceInPeriod(LocalDate start, LocalDate end) {
        return attendanceRepository.findAll().stream()
                .filter(a -> !a.getDate().isBefore(start) && !a.getDate().isAfter(end))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public double getAttendancePercentage(Long employeeId) {
        List<Attendance> list = attendanceRepository.findByEmployeeId(employeeId);
        if (list.isEmpty()) {
            return 0.0;
        }

        long presentOrLate = list.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.PRESENT || a.getStatus() == AttendanceStatus.LATE)
                .count();

        return (double) presentOrLate / list.size() * 100.0;
    }

    public double getOrgAttendancePercentage() {
        List<Attendance> list = attendanceRepository.findAll();
        if (list.isEmpty()) {
            return 0.0;
        }

        long presentOrLate = list.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.PRESENT || a.getStatus() == AttendanceStatus.LATE)
                .count();

        return (double) presentOrLate / list.size() * 100.0;
    }

    public double getTeamAttendancePercentage(Long managerId) {
        List<Attendance> list = attendanceRepository.findAll().stream()
                .filter(a -> a.getEmployee().getManager() != null && a.getEmployee().getManager().getId().equals(managerId))
                .collect(Collectors.toList());
        if (list.isEmpty()) {
            return 0.0;
        }

        long presentOrLate = list.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.PRESENT || a.getStatus() == AttendanceStatus.LATE)
                .count();

        return (double) presentOrLate / list.size() * 100.0;
    }

    public AttendanceDTO convertToDTO(Attendance attendance) {
        if (attendance == null) return null;
        return AttendanceDTO.builder()
                .id(attendance.getId())
                .employeeId(attendance.getEmployee().getId())
                .employeeName(attendance.getEmployee().getName())
                .date(attendance.getDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .status(attendance.getStatus())
                .build();
    }
}
