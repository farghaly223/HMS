package com.hms.patient.controller;

import com.hms.patient.entity.Patient;
import com.hms.patient.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class MedicalHistoryController {
    
    @Autowired
    private PatientRepository patientRepository;
    
    // Get medical history for patient
    @GetMapping("/{patientId}/medical-history")
    public ResponseEntity<?> getMedicalHistory(@PathVariable Long patientId) {
        try {
            Patient patient = patientRepository.findById(patientId)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
    
    // Add/Update medical history
    @PostMapping("/{patientId}/medical-history")
    public ResponseEntity<?> addMedicalHistory(@PathVariable Long patientId, 
                                               @RequestBody Patient medicalData) {
        try {
            Patient patient = patientRepository.findById(patientId)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            
            patient.setVisitDate(medicalData.getVisitDate());
            patient.setDiagnosis(medicalData.getDiagnosis());
            patient.setTreatment(medicalData.getTreatment());
            patient.setMedications(medicalData.getMedications());
            patient.setTests(medicalData.getTests());
            patient.setNotes(medicalData.getNotes());
            
            Patient saved = patientRepository.save(patient);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
    
    // Update medical history
    @PutMapping("/{patientId}/medical-history/{historyId}")
    public ResponseEntity<?> updateMedicalHistory(@PathVariable Long patientId,
                                                   @PathVariable Long historyId,
                                                   @RequestBody Patient medicalData) {
        try {
            Patient patient = patientRepository.findById(patientId)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            
            if (medicalData.getVisitDate() != null) 
                patient.setVisitDate(medicalData.getVisitDate());
            if (medicalData.getDiagnosis() != null) 
                patient.setDiagnosis(medicalData.getDiagnosis());
            if (medicalData.getTreatment() != null) 
                patient.setTreatment(medicalData.getTreatment());
            if (medicalData.getMedications() != null) 
                patient.setMedications(medicalData.getMedications());
            if (medicalData.getTests() != null) 
                patient.setTests(medicalData.getTests());
            if (medicalData.getNotes() != null) 
                patient.setNotes(medicalData.getNotes());
            
            Patient updated = patientRepository.save(patient);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
    
    // Delete medical history
    @DeleteMapping("/{patientId}/medical-history/{historyId}")
    public ResponseEntity<?> deleteMedicalHistory(@PathVariable Long patientId,
                                                   @PathVariable Long historyId) {
        try {
            Patient patient = patientRepository.findById(patientId)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            
            patient.setVisitDate(null);
            patient.setDiagnosis(null);
            patient.setTreatment(null);
            patient.setMedications(null);
            patient.setTests(null);
            patient.setNotes(null);
            
            patientRepository.save(patient);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}