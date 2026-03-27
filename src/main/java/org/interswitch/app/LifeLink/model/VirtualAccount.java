package org.interswitch.app.LifeLink.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Data
public class VirtualAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "virtual_seq")
    @SequenceGenerator(name = "virtual_seq", sequenceName = "virtual_sequence", allocationSize = 1)
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
