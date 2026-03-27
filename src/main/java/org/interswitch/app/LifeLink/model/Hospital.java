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
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;
    @Column(name = "hospital_name", unique = true)
    private String hospitalName;
    @Column(name = "hefama_id", unique = true)
    private String hefama;
    private String address;
    @Column(name = "admin_name", unique = true, nullable = false)
    private String adminName;
    @Column(nullable = false, unique = true, name = "hospital_email")
    private String hospitalEmail;
    @Column(nullable = false)
    private String adminPhone;
    @OneToOne
    @JoinColumn(name = "settlement_account_account_id", referencedColumnName = "accountId")
    private HospitalAccount settlementAccount;
    @Column(unique = true)
    private String accountPassword;
}
