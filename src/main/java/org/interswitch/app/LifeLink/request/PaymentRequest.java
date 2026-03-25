package org.interswitch.app.LifeLink.request;

import lombok.Data;

@Data
public class PaymentRequest {

    private String event;
    private String uuid;
    private long timestamp;
    private PaymentData data;
}
