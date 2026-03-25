package org.interswitch.app.LifeLink.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long caseId;
    private BigDecimal bridgedAmount; //amount requested by the customer
    private BigDecimal interestAmount; //interest amount calculated based on the bridged amount
    private BigDecimal totalRepaymentAmount; //total amount to be repaid by the customer
    private String loanStatus;
}
