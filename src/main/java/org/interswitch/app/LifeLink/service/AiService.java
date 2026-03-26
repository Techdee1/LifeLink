package org.interswitch.app.LifeLink.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class AiService {

    private final WebClient webClient;

    @Value("${AI_SERVICE_URL:http://localhost:8000}")
    private String aiServiceBaseUrl;

    public AiService(WebClient webClient) {
        this.webClient = webClient;
    }

    public Map<String, Object> chat(String message, String conversationId, String language, String hospitalId) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("message", message);
        if (conversationId != null) requestBody.put("conversation_id", conversationId);
        if (language != null) requestBody.put("language", language);
        if (hospitalId != null) requestBody.put("hospital_id", hospitalId);

        try {
            return webClient.post()
                    .uri(aiServiceBaseUrl + "/api/v1/ai/chat")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (WebClientResponseException e) {
            log.error("AI chat request failed: {}", e.getResponseBodyAsString());
            return Map.of("error", "AI service unavailable", "detail", e.getMessage());
        }
    }

    public Map<String, Object> getLoanRiskScore(Long caseId, BigDecimal loanAmount) {
        Map<String, Object> requestBody = new HashMap<>();
        if (loanAmount != null) requestBody.put("loan_amount", loanAmount.doubleValue());

        try {
            return webClient.post()
                    .uri(aiServiceBaseUrl + "/api/v1/ai/loans/" + caseId + "/risk-score")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (WebClientResponseException e) {
            log.error("AI risk scoring request failed: {}", e.getResponseBodyAsString());
            return Map.of("error", "AI service unavailable", "detail", e.getMessage());
        }
    }

    public Map<String, Object> getCasePrediction(Long caseId) {
        try {
            return webClient.post()
                    .uri(aiServiceBaseUrl + "/api/v1/ai/cases/" + caseId + "/predict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (WebClientResponseException e) {
            log.error("AI case prediction request failed: {}", e.getResponseBodyAsString());
            return Map.of("error", "AI service unavailable", "detail", e.getMessage());
        }
    }
}
