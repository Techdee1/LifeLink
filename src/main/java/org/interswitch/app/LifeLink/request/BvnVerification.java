package org.interswitch.app.LifeLink.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BvnVerification {

    private String accountNumber;
    private String bankCode;
}
