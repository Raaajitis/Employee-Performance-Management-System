package com.epms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "performance_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private Employee reviewer;

    @Column(name = "technical_skills", nullable = false)
    private Integer technicalSkills;

    @Column(nullable = false)
    private Integer communication;

    @Column(nullable = false)
    private Integer teamwork;

    @Column(name = "problem_solving", nullable = false)
    private Integer problemSolving;

    @Column(nullable = false)
    private Integer leadership;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(nullable = false)
    private Double score;

    @Column(name = "review_date", nullable = false)
    private LocalDate reviewDate;
}
