package com.epms.controller;

import com.epms.security.UserPrincipal;
import com.epms.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<?> getDashboardSummary(@AuthenticationPrincipal UserPrincipal currentUser) {
        String role = currentUser.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("ROLE_EMPLOYEE");

        if (role.equals("ROLE_ADMIN")) {
            return ResponseEntity.ok(dashboardService.getAdminDashboard());
        } else if (role.equals("ROLE_MANAGER")) {
            return ResponseEntity.ok(dashboardService.getManagerDashboard(currentUser.getId()));
        } else {
            return ResponseEntity.ok(dashboardService.getEmployeeDashboard(currentUser.getId()));
        }
    }
}
