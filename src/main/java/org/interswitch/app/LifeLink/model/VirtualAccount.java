package org.interswitch.app.LifeLink.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Data
public class VirtualAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String bankCode;
    private String virtualAccountNumber;
    private String bankName;
    private String accountName;
    private Long caseId;
    private String patientName;
    private String patientEmail;
    private PatientCase status;
    private BigDecimal raisedAmount;
    private BigDecimal targetAmount;
    private Double percentage;


}
