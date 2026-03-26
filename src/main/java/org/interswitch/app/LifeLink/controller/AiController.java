package org.interswitch.app.LifeLink.controller;

import org.interswitch.app.LifeLink.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lifelink/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> request) {
        Map<String, Object> response = aiService.chat(
                request.get("message"),
                request.get("conversation_id"),
                request.get("language"),
                request.get("hospital_id")
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/loans/{caseId}/risk-score")
    public ResponseEntity<Map<String, Object>> riskScore(
            @PathVariable Long caseId,
            @RequestBody(required = false) Map<String, Object> request) {
        BigDecimal loanAmount = null;
        if (request != null && request.containsKey("loan_amount")) {
            loanAmount = new BigDecimal(request.get("loan_amount").toString());
        }
        Map<String, Object> response = aiService.getLoanRiskScore(caseId, loanAmount);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cases/{caseId}/predict")
    public ResponseEntity<Map<String, Object>> predict(@PathVariable Long caseId) {
        Map<String, Object> response = aiService.getCasePrediction(caseId);
        return ResponseEntity.ok(response);
    }
}
