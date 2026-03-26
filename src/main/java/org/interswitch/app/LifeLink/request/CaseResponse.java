package org.interswitch.app.LifeLink.request;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public class CaseResponse {
    private Long caseId;
    private String patientName;
    private String status;
    private BigDecimal raisedAmount;
    private BigDecimal targetAmount;
    private String percentage;
    private String virtualAccountNumber;
    private String bankName;
    private String createdAt;
}
