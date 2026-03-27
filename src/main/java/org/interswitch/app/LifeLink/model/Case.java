package org.interswitch.app.LifeLink.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "cases")
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "case_seq")
    @SequenceGenerator(name = "case_seq", sequenceName = "case_sequence", allocationSize = 1)
    private Long caseId;
    @ManyToOne
    @JoinColumn(name = "hospital_account", referencedColumnName = "id")
    private Hospital hospital;

    @Column(unique = true)
    private String patientName;
    private String leadKinName;
    private String leadKinPhone;
    @Column(unique = true)
    private String patientEmail;
    private BigDecimal depositTarget;
    private PatientCase patientCase;
    private boolean bridgeAlertSent;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
