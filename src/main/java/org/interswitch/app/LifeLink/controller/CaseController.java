package org.interswitch.app.LifeLink.controller;

import org.interswitch.app.LifeLink.request.CaseRequest;
import org.interswitch.app.LifeLink.service.HospitalService;
import org.interswitch.app.LifeLink.service.InterswitchService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("/initiate")
    public ResponseEntity<Map<String,Object>> createCase(@RequestBody CaseRequest caseRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hospitalService.createPatientCase(caseRequest));
    }

    @GetMapping("/token")
    public String getToken() {
        return interswitchService.getInterswitchPaymentAccessToken().getAccess_token();
    }
}
