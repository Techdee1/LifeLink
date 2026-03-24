package org.interswitch.app.LifeLink.service;

import org.interswitch.app.LifeLink.request.AccessTokenResponse;
import org.interswitch.app.LifeLink.request.CaseRequest;
import org.interswitch.app.LifeLink.request.VirtualAccountRequest;
import org.interswitch.app.LifeLink.request.VirtualAccountResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class InterswitchService {

    @Autowired
    private WebClient webClient;
    @Value("${INTERSWITCH.CLIENT_ID}")
    private String CLIENT_ID;
    @Value("${INTERSWITCH.CLIENT_SECRET}")
    private String CLIENT_SECRET;
    @Value("${INTERSWITCH.MERCHANT_CODE}")
    private String MERCHANT_CODE;


    public VirtualAccountResponse createVirtualAccount(CaseRequest caseRequest) {
        AccessTokenResponse accessTokenResponse =  getInterswitchToken();
        System.out.println("Token: "+ accessTokenResponse.getAccess_token());
        // Update these lines in your Service class
        String url = "https://qa.interswitchng.com/paymentgateway/api/v1/payable/virtualaccount";

        Map<String, Object> body = new HashMap<>();
        body.put("merchantCode", "MX1111"); // Use universal merchant
        body.put("accountName", "LIFELINK-ST-NICHOLAS");

        String data =  webClient.post()
                .uri(url)
                .header("Authorization", "Bearer " + accessTokenResponse.getAccess_token())
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        System.out.println(data);
        return new VirtualAccountResponse();
    }

    public AccessTokenResponse getInterswitchToken() {
        // 1. Ensure UTF_8 encoding for the Base64 string
        String auth = CLIENT_ID.trim() + ":" + CLIENT_SECRET.trim();
        System.out.println(auth);
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
        System.out.println(encodedAuth);
        return WebClient.builder()
                .baseUrl("https://qa.interswitchng.com") // Use the sandbox URL
                .build()
                .post()
                .uri("/passport/oauth/token")
                .header("Authorization", "Basic " + encodedAuth)
                // 2. MUST be x-www-form-urlencoded
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "client_credentials"))
                .retrieve()
                .bodyToMono(AccessTokenResponse.class)
                .block();
    }
}
