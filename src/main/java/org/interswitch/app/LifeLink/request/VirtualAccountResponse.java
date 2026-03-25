package org.interswitch.app.LifeLink.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VirtualAccountResponse {

    private Integer id;
    private String merchantCode;
    private String payableCode;
    private String payableExpressionTypeId;
    private String name;
    private boolean enabled;
    private Long dateCreated;
    private String accountName;
    private String accountNumber;
    private Integer payableExpressionId;
    private String bankName;
    private String bankCode;
    private Long createdOn;
    private String auditableName;
    private Integer auditableId;

}

