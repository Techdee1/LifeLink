package org.interswitch.app.LifeLink.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.AccessType;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class CaseRequest {

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private UUID hId;
    private String patientName;
    private String leadKinName;
    private String patientEmail;
    private String leadKinPhone;
    private BigDecimal depositTarget; //Naira
}
