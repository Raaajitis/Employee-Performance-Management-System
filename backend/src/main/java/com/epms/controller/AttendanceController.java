package com.epms.controller;

import com.epms.dto.AttendanceDTO;
import com.epms.security.UserPrincipal;
import com.epms.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(@AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            AttendanceDTO dto = attendanceService.checkIn(currentUser.getId());
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut(@AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            AttendanceDTO dto = attendanceService.checkOut(currentUser.getId());
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<AttendanceDTO>> getMyHistory(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(attendanceService.getEmployeeAttendance(currentUser.getId()));
    }

    @GetMapping("/my-percentage")
    public ResponseEntity<Map<String, Double>> getMyPercentage(@AuthenticationPrincipal UserPrincipal currentUser) {
        double pct = attendanceService.getAttendancePercentage(currentUser.getId());
        Map<String, Double> response = new HashMap<>();
        response.put("percentage", pct);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/team-today")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<AttendanceDTO>> getTeamAttendanceToday(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(attendanceService.getTeamAttendanceToday(currentUser.getId()));
    }

    @GetMapping("/team-history")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<AttendanceDTO>> getTeamAttendanceHistory(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getTeamAttendanceInPeriod(currentUser.getId(), startDate, endDate));
    }

    @GetMapping("/org-today")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AttendanceDTO>> getOrgAttendanceToday() {
        return ResponseEntity.ok(attendanceService.getOrgAttendanceToday());
    }

    @GetMapping("/org-history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AttendanceDTO>> getOrgAttendanceHistory(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getOrgAttendanceInPeriod(startDate, endDate));
    }
}
