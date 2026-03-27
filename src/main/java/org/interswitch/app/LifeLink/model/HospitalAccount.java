package org.interswitch.app.LifeLink.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HospitalAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID accountId;

    @Column(name = "account_number", nullable = false, unique = true)
    private String accountNumber;
    @Column(name = "bank_code", nullable = false)
    private String bankCode;
    @Column(name = "account_name", nullable = false, unique = true)
    private String accountName;
}
