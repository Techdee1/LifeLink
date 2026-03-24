package org.interswitch.app.LifeLink.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long caseId;
    private String hospitalId;
    private String patientName;
    private String leadKinName;
    private String leadKinPhone;
    private String depositTarget; //Naira
}
