package org.interswitch.app.LifeLink.model;

import jakarta.persistence.*;
import lombok.Data;
import org.interswitch.app.LifeLink.request.PaymentData;

@Data
@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String event;
    @Column(unique = true)
    private String uuid;
    private long timestamp;
    private PaymentData data;
    private String accountName;
}
