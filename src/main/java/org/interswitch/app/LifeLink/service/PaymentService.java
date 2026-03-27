package org.interswitch.app.LifeLink.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.interswitch.app.LifeLink.model.Loan;
import org.interswitch.app.LifeLink.model.LoanStatus;
import org.interswitch.app.LifeLink.model.Payment;
import org.interswitch.app.LifeLink.repository.LoanRepository;
import org.interswitch.app.LifeLink.repository.PaymentRepository;
import org.interswitch.app.LifeLink.request.ApiResponse;
import org.interswitch.app.LifeLink.request.LiquidityRequest;
import org.interswitch.app.LifeLink.request.LoanResponse;
import org.interswitch.app.LifeLink.request.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

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
    @Autowired
    private AiService aiService;


    @Async
    public void createPaymentWebhook(PaymentRequest paymentRequest) {

        if (paymentRequest.getUuid() == null) {
            return;
        }

        Payment payment = new Payment();
        payment.setData(paymentRequest.getData());
        payment.setUuid(paymentRequest.getUuid());
        payment.setEvent(paymentRequest.getEvent());
        payment.setTimestamp(paymentRequest.getTimestamp());

        if (paymentRequest.getData() != null) {
            payment.setAccountName(paymentRequest.getData().getMerchantCustomerName());
        }

        try {
            paymentRepository.save(payment);
        } catch (DataIntegrityViolationException e) {
            // duplicate webhook → ignore
        }
    }
    public static String generateHmac(String secretKey, String rawBody) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");

        SecretKeySpec secretKeySpec =
                new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");

        mac.init(secretKeySpec);

        byte[] rawHmac = mac.doFinal(rawBody.getBytes(StandardCharsets.UTF_8));

        return Base64.getEncoder().encodeToString(rawHmac);
    }

    public Map<String,Object> requestForLiquidity(LiquidityRequest liquidityRequest, Long caseId) throws JsonProcessingException {
        if(interswitchService.verifyBVN(liquidityRequest)) {
            Map<String,Object> data = hospitalService.viewCaseProgress(caseId);
            if(Boolean.parseBoolean(data.get("is_bridge_eligible").toString())) {
                BigDecimal targetAmount = new BigDecimal(data.get("target_amount").toString());
                BigDecimal raisedAmount = new BigDecimal(data.get("raised_amount").toString());
                BigDecimal amountNeeded = targetAmount.subtract(raisedAmount);

                // AI risk scoring pre-check
                try {
                    Map<String, Object> riskResult = aiService.getLoanRiskScore(caseId, amountNeeded);
                    String recommendation = riskResult.getOrDefault("recommendation", "APPROVE").toString();
                    if ("DENY".equals(recommendation)) {
                        return Map.of("message", "Bridge loan denied by risk assessment.",
                                "risk_score", riskResult.getOrDefault("risk_score", 0),
                                "explanation", riskResult.getOrDefault("explanation", ""));
                    }
                } catch (Exception e) {
                    log.warn("AI risk scoring unavailable, proceeding without: {}", e.getMessage());
                }

                LoanResponse loanResponse = interswitchService.lendBridge(liquidityRequest, hospitalService.getCaseById(caseId),amountNeeded,raisedAmount);
                hospitalService.updateCaseProgress(caseId);

                Loan loan = new Loan();
                loan.setCaseId(caseId);
                loan.setBridgedAmount(amountNeeded);
                BigDecimal interestAmount = amountNeeded.multiply(BigDecimal.valueOf(0.115));
                loan.setInterestAmount(interestAmount);
                loan.setLoanStatus(LoanStatus.PAID.name());
                loan.setDeadline(LocalDateTime.now().plusDays(14));
                loan.setTotalRepaymentAmount(amountNeeded.add(interestAmount));

                loanRepository.save(loan);

                return Map.of("responseCode",loanResponse.getResponseCode(),"bridged_amount", amountNeeded,"message", loanResponse.getResponseMessage());
            }
            return Map.of("message", "BVN verified, but case is not eligible for bridge funding.");
        }
        return Map.of("message", "BVN verification failed, bridge funding request denied.");
    }
}
