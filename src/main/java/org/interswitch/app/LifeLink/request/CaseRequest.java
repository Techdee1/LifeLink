package org.interswitch.app.LifeLink.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.AccessType;

@Getter
@Setter
@NoArgsConstructor
public class CaseRequest {

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String hospitalId;
    private String patientName;
    private String leadKinName;
    private String leadKinPhone;
    private String depositTarget; //Naira
}
