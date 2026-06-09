package com.epms.service;

import com.epms.dto.PerformanceReviewDTO;
import com.epms.entity.Employee;
import com.epms.entity.PerformanceReview;
import com.epms.repository.EmployeeRepository;
import com.epms.repository.PerformanceReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private PerformanceReviewRepository reviewRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional
    public PerformanceReviewDTO submitReview(PerformanceReviewDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + dto.getEmployeeId()));

        Employee reviewer = employeeRepository.findById(dto.getReviewerId())
                .orElseThrow(() -> new RuntimeException("Reviewer/Manager not found with id: " + dto.getReviewerId()));

        // Calculate score: (Technical + Communication + Teamwork + Problem Solving + Leadership) / 5.0
        double calculatedScore = (
                dto.getTechnicalSkills() +
                dto.getCommunication() +
                dto.getTeamwork() +
                dto.getProblemSolving() +
                dto.getLeadership()
        ) / 5.0;

        PerformanceReview review = PerformanceReview.builder()
                .employee(employee)
                .reviewer(reviewer)
                .technicalSkills(dto.getTechnicalSkills())
                .communication(dto.getCommunication())
                .teamwork(dto.getTeamwork())
                .problemSolving(dto.getProblemSolving())
                .leadership(dto.getLeadership())
                .comments(dto.getComments())
                .score(calculatedScore)
                .reviewDate(LocalDate.now())
                .build();

        PerformanceReview saved = reviewRepository.save(review);
        return convertToDTO(saved);
    }

    public List<PerformanceReviewDTO> getEmployeeReviews(Long employeeId) {
        return reviewRepository.findByEmployeeId(employeeId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PerformanceReviewDTO> getReviewsWrittenByManager(Long reviewerId) {
        return reviewRepository.findByReviewerId(reviewerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public double getEmployeeAverageScore(Long employeeId) {
        List<PerformanceReview> list = reviewRepository.findByEmployeeId(employeeId);
        if (list.isEmpty()) {
            return 0.0;
        }

        double sum = list.stream()
                .mapToDouble(PerformanceReview::getScore)
                .sum();

        return sum / list.size();
    }

    public long getPendingReviewsCountForManager(Long managerId) {
        // Find team members
        List<Employee> team = employeeRepository.findByManagerId(managerId);
        
        // Count how many team members do not have a review in the current quarter or at all
        // Let's keep it simple: team members who have never been reviewed
        long count = 0;
        for (Employee e : team) {
            List<PerformanceReview> reviews = reviewRepository.findByEmployeeId(e.getId());
            if (reviews.isEmpty()) {
                count++;
            }
        }
        return count;
    }

    public long getPendingReviewsCountAll() {
        // Count total employees without any review
        List<Employee> allEmployees = employeeRepository.findAll();
        long count = 0;
        for (Employee e : allEmployees) {
            if (e.getUser() != null && e.getUser().getRole() == com.epms.entity.Role.EMPLOYEE) {
                List<PerformanceReview> reviews = reviewRepository.findByEmployeeId(e.getId());
                if (reviews.isEmpty()) {
                    count++;
                }
            }
        }
        return count;
    }

    public PerformanceReviewDTO convertToDTO(PerformanceReview review) {
        if (review == null) return null;
        return PerformanceReviewDTO.builder()
                .id(review.getId())
                .employeeId(review.getEmployee().getId())
                .employeeName(review.getEmployee().getName())
                .reviewerId(review.getReviewer().getId())
                .reviewerName(review.getReviewer().getName())
                .technicalSkills(review.getTechnicalSkills())
                .communication(review.getCommunication())
                .teamwork(review.getTeamwork())
                .problemSolving(review.getProblemSolving())
                .leadership(review.getLeadership())
                .comments(review.getComments())
                .score(review.getScore())
                .reviewDate(review.getReviewDate())
                .build();
    }
}
