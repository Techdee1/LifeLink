package org.interswitch.app.LifeLink.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
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
    @Value("${INTERSWITCH.GENERAL_CLIENT_SECRET}")
    private String GENERAL_CLIENT_SECRET;

    @PostMapping("/initiate")
    public ResponseEntity<Map<String,Object>> createCase(@RequestBody CaseRequest caseRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hospitalService.createPatientCase(caseRequest));
    }

    @GetMapping("/token")
    public String getToken() {
        return interswitchService.getInterswitchPaymentAccessToken().getAccess_token();
    }

    @GetMapping("/{caseId}")
    private ResponseEntity<Map<String,Object>> viewPatientCaseProgress(@PathVariable Long caseId) {
        return ResponseEntity.ok().body(hospitalService.viewCaseProgress(caseId));
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(
            @RequestHeader("X-Interswitch-Signature") String signature,
            @RequestBody PaymentRequest paymentRequest) throws Exception {
        String generatedHash = PaymentService.generateHmac(GENERAL_CLIENT_SECRET, paymentRequest);

        if (!generatedHash.equals(signature)) {
            return ResponseEntity.status(403).body("Invalid signature");
        }
        return ResponseEntity.ok().body(paymentService.createPaymentWebhook(paymentRequest));
    }

    @PostMapping("/{caseId}/bridge")
    public ResponseEntity<?> requestLiquidity(@RequestBody LiquidityRequest liquidityRequest, @PathVariable Long caseId) throws JsonProcessingException {
        return ResponseEntity.ok().body(paymentService.requestForLiquidity(liquidityRequest,caseId));
    }
}
