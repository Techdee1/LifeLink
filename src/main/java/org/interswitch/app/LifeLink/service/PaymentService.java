package org.interswitch.app.LifeLink.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.interswitch.app.LifeLink.model.Loan;
import org.interswitch.app.LifeLink.model.Payment;
import org.interswitch.app.LifeLink.repository.LoanRepository;
import org.interswitch.app.LifeLink.repository.PaymentRepository;
import org.interswitch.app.LifeLink.request.ApiResponse;
import org.interswitch.app.LifeLink.request.LiquidityRequest;
import org.interswitch.app.LifeLink.request.LoanResponse;
import org.interswitch.app.LifeLink.request.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.util.Map;

@Slf4j
@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private InterswitchService interswitchService;
    @Autowired
    private HospitalService hospitalService;
    @Autowired
    private LoanRepository loanRepository;

    public String createPaymentWebhook(PaymentRequest paymentRequest) {
        Payment payment = new Payment();
        payment.setData(paymentRequest.getData());
        payment.setUuid(paymentRequest.getUuid());
        payment.setEvent(paymentRequest.getEvent());
        payment.setTimestamp(paymentRequest.getTimestamp());
        payment.setAccountName(paymentRequest.getData().getMerchantCustomerName());

        paymentRepository.save(payment);
        return "Payment info received";
    }
    public static String generateHmac(String secretKey, PaymentRequest message) throws Exception {

        Mac mac = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA512");

        mac.init(secretKeySpec);
        byte[] rawHmac = mac.doFinal(message.toString().getBytes());

        StringBuilder hex = new StringBuilder();
        for (byte b : rawHmac) {
            hex.append(String.format("%02x", b));
        }

        return hex.toString();
    }

    public Map<String,Object> requestForLiquidity(LiquidityRequest liquidityRequest, Long caseId) throws JsonProcessingException {
        if(interswitchService.verifyBVN(liquidityRequest)) {
            if(Boolean.parseBoolean(hospitalService.viewCaseProgress(caseId).get("is_bridge_eligible").toString())) {
                Map<String,Object> data = hospitalService.viewCaseProgress(caseId);
                BigDecimal targetAmount = new BigDecimal(data.get("target_amount").toString());
                BigDecimal raisedAmount = new BigDecimal(data.get("raised_amount").toString());
                BigDecimal amountNeeded = targetAmount.subtract(raisedAmount);

                LoanResponse loanResponse = interswitchService.lendBridge(liquidityRequest, hospitalService.getCaseById(caseId),amountNeeded,raisedAmount);
                hospitalService.updateCaseProgress(caseId);

                Loan loan = new Loan();
                loan.setCaseId(caseId);
                loan.setBridgedAmount(amountNeeded);
                BigDecimal interestAmount = amountNeeded.multiply(BigDecimal.valueOf(0.115));
                loan.setInterestAmount(interestAmount);
                loan.setTotalRepaymentAmount(amountNeeded.add(interestAmount));

                loanRepository.save(loan);

                return Map.of("responseCode",loanResponse.getResponseCode(),"bridged_amount", amountNeeded,"message", loanResponse.getResponseMessage());
            }
            return Map.of("message", "BVN verified, but case is not eligible for bridge funding.");
        }
        return Map.of("message", "BVN verification failed, bridge funding request denied.");
    }
}
