package org.interswitch.app.LifeLink.request;

import lombok.Data;

@Data
public class VirtualAccountResponse {

    private Integer id;
    private String merchantCode;
    private String payableCode;
    private boolean enabled;
    private Long dateCreated;
    private String accountName;
    private String accountNumber;
    private String bankName;
    private String bankCode;
}

