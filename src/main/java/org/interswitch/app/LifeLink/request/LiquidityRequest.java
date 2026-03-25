package org.interswitch.app.LifeLink.request;

import lombok.Data;

@Data
public class LiquidityRequest {

    private String firstName;
    private String lastName;
    private String leadKinBvn;
    private String leadKinNin;
    private String accountNumber;
    private String bankName;
    private String bankCode;
    private boolean agreedToTerms;

}
