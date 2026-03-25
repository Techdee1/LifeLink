package org.interswitch.app.LifeLink.request;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@Embeddable
public class PaymentData {


    private BigDecimal remittanceAmount;
    private String bankCode;
    private BigDecimal amount;
    private String paymentReference;
    private String channel;
    private List<Object> splitAccounts;
    private String retrievalReferenceNumber;
    private long transactionDate;
    private String accountNumber;
    private String responseCode;
    private String token;
    private String responseDescription;
    private long paymentId;
    private String merchantCustomerId;
    private boolean escrow;
    private String merchantReference;
    private String currencyCode;
    private String merchantCustomerName;
    private String cardNumber;
}
