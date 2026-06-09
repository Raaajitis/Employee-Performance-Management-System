package com.epms.controller;

import com.epms.dto.PerformanceReviewDTO;
import com.epms.security.UserPrincipal;
import com.epms.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<?> submitReview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody PerformanceReviewDTO dto) {
        try {
            // Override reviewer ID to the currently logged in manager's ID
            dto.setReviewerId(currentUser.getId());
            PerformanceReviewDTO result = reviewService.submitReview(dto);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> getEmployeeReviews(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long employeeId) {
        
        // Authorization check: Employee can view their own reviews. Managers and Admins can view any reviews.
        if (currentUser.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_MANAGER"))
                && !currentUser.getId().equals(employeeId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Access denied. You can only view your own reviews.");
            return ResponseEntity.status(403).body(response);
        }

        return ResponseEntity.ok(reviewService.getEmployeeReviews(employeeId));
    }

    @GetMapping("/written-by-me")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<PerformanceReviewDTO>> getMyWrittenReviews(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(reviewService.getReviewsWrittenByManager(currentUser.getId()));
    }
}
