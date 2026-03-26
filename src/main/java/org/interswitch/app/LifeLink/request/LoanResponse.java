package org.interswitch.app.LifeLink.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoanResponse {

    private String responseCode;
    private String responseMessage;
    private String transactionRef;
    private String transactionId;
    private String loanId;
}
