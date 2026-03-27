package org.interswitch.app.LifeLink.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.interswitch.app.LifeLink.request.CaseRequest;
import org.interswitch.app.LifeLink.request.LiquidityRequest;
import org.interswitch.app.LifeLink.request.PaymentRequest;
import org.interswitch.app.LifeLink.service.HospitalService;
import org.interswitch.app.LifeLink.service.InterswitchService;
import org.interswitch.app.LifeLink.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lifelink/cases")
public class CaseController {

    @Autowired
    private HospitalService hospitalService;
    @Autowired
    private InterswitchService interswitchService;
    @Autowired
    private PaymentService paymentService;
    @Value("${INTERSWITCH.WEBHOOK_SECRET_KEY}")
    private String GENERAL_CLIENT_SECRET;
    @Value("${INTERSWITCH.GENERAL_CLIENT_ID}")
    private String GENERAL_CLIENT_ID;
    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/initiate")
    public ResponseEntity<Map<String,Object>> createCase(@RequestBody CaseRequest caseRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hospitalService.createPatientCase(caseRequest));
    }

    @GetMapping("/token")
    public String getToken() {
        return interswitchService.getInterswitchPaymentAccessToken(GENERAL_CLIENT_ID,GENERAL_CLIENT_SECRET).getAccess_token();
    }

    @GetMapping("/{caseId}")
    private ResponseEntity<Map<String,Object>> viewPatientCaseProgress(@PathVariable Long caseId) {
        return ResponseEntity.ok().body(hospitalService.viewCaseProgress(caseId));
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(
            @RequestHeader(value = "X-Interswitch-Signature", required = false) String signature,
            @RequestBody String rawBody) throws Exception {

        if (signature == null || signature.isEmpty()) {
            return ResponseEntity.status(400).body("Missing signature");
        }

        String generatedHash = PaymentService.generateHmac(GENERAL_CLIENT_SECRET, rawBody);

        if (!MessageDigest.isEqual(
                generatedHash.getBytes(StandardCharsets.UTF_8),
                signature.getBytes(StandardCharsets.UTF_8))) {
            return ResponseEntity.status(403).body("Invalid signature");
        }

        try {
            PaymentRequest paymentRequest = objectMapper.readValue(rawBody, PaymentRequest.class);
            paymentService.createPaymentWebhook(paymentRequest);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Invalid payload");
        }

        return ResponseEntity.ok("Payment received");
    }


    @GetMapping("/history")
    public ResponseEntity<?> getCaseHistory(@RequestParam int pageNo, @RequestParam int pageSize) {
        return ResponseEntity.ok().body(hospitalService.fetchAllCases(pageNo,pageSize));
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveCases() {
        return ResponseEntity.ok().body(hospitalService.fetchCompletedCase());
    }

    @PostMapping("/{caseId}/bridge")
    public ResponseEntity<?> requestLiquidity(@RequestBody LiquidityRequest liquidityRequest, @PathVariable Long caseId) throws JsonProcessingException {
        return ResponseEntity.ok().body(paymentService.requestForLiquidity(liquidityRequest,caseId));
    }
}
