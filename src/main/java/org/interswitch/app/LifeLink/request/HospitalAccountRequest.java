package org.interswitch.app.LifeLink.request;

import lombok.Data;

@Data
public class HospitalAccountRequest {

    private String accountNumber;
    private String bankCode;
    private String accountName;
}
