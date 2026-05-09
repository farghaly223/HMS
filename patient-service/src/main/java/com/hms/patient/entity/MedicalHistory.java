package com.hms.patient.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
public class Patient {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "name", length = 100, nullable = false)
    private String name;
    
    @Column(name = "phone", length = 20)
    private String phone;
    
    @Column(name = "gender", nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Column(name = "blood_group", length = 5)
    private String bloodGroup;
    
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "emergency_contact", length = 20)
    private String emergencyContact;
    
    // MEDICAL HISTORY COLUMNS
    @Column(name = "visit_date")
    private LocalDateTime visitDate;
    
    @Column(name = "diagnosis", columnDefinition = "LONGTEXT")
    private String diagnosis;
    
    @Column(name = "treatment", columnDefinition = "LONGTEXT")
    private String treatment;
    
    @Column(name = "medications", columnDefinition = "LONGTEXT")
    private String medications;
    
    @Column(name = "tests", columnDefinition = "LONGTEXT")
    private String tests;
    
    @Column(name = "notes", columnDefinition = "LONGTEXT")
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters (generate these)
    // ... all getter/setter methods
}

enum Gender {
    MALE, FEMALE
}