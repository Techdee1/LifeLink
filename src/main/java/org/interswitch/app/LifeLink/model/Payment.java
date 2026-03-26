package org.interswitch.app.LifeLink.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import org.interswitch.app.LifeLink.request.PaymentData;

@Data
@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String event;
    private String uuid;
    private long timestamp;
    private PaymentData data;
    private String accountName;
}
