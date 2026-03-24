package org.interswitch.app.LifeLink.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.AccessType;

import java.util.UUID;

@Data
public class HospitalDataRequest  {

    private String hospitalName;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) String hefama;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) String address;
    String adminName;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) String hospitalEmail;
    String adminPhone;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private HospitalAccountRequest settlementAccount;
    private@JsonProperty(access = JsonProperty.Access.WRITE_ONLY) String accountPassword;
}
