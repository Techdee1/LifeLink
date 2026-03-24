package org.interswitch.app.LifeLink.request;

import lombok.Data;

@Data
public class VirtualAccountRequest {

    private String accountName;
    private String merchantCode;
}
