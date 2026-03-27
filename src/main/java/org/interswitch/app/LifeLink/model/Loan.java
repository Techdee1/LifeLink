package org.interswitch.app.LifeLink.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long caseId;
    private BigDecimal bridgedAmount; //amount requested by the customer
    private BigDecimal interestAmount; //interest amount calculated based on the bridged amount
    private BigDecimal totalRepaymentAmount; //total amount to be repaid by the customer
    private String loanStatus;
    private LocalDateTime deadline;
}
