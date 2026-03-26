package org.interswitch.app.LifeLink.controller;

import org.interswitch.app.LifeLink.model.Hospital;
import org.interswitch.app.LifeLink.request.HospitalDataRequest;
import org.interswitch.app.LifeLink.request.HospitalLoginRequest;
import org.interswitch.app.LifeLink.request.RefreshTokenRequest;
import org.interswitch.app.LifeLink.service.HospitalService;
import org.interswitch.app.LifeLink.service.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/lifelink/hospitals")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;
    @Autowired
    private JwtService jwtService;

    @PostMapping("/auth/onboard")
    public Map<String,Object> createHospitalAccount(@RequestBody HospitalDataRequest hospitalDataRequest) {
        return ResponseEntity.status(HttpStatus.CREATED.value()).body(hospitalService.createHospitalAccount(hospitalDataRequest))
                .getBody();
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<Map<String, Object>> fetchAccessToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        String hospitalEmail = jwtService.getEmail(refreshTokenRequest.getRefreshToken());
        Hospital hospital = hospitalService.fetchByHospitalEmail(hospitalEmail);
        Map<String,Object> data = jwtService.createAccessKey(hospital);
        return ResponseEntity.status(HttpStatus.CREATED.value()).body(data);
    }

    @PostMapping("/auth/login")
    public void login(@RequestBody HospitalLoginRequest hospitalLoginRequest) {

    }

    @GetMapping("/data/{hospitalEmail}")
    public HospitalDataRequest getHospitalDataByEmail(@PathVariable String hospitalEmail) {
        return ResponseEntity.ok().body(hospitalService.
                getHospitalByEmail(hospitalEmail)).getBody();
    }
}
