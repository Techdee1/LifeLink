package org.interswitch.app.LifeLink.controller;

import org.interswitch.app.LifeLink.request.HospitalDataRequest;
import org.interswitch.app.LifeLink.service.HospitalService;
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

    @PostMapping("/auth/onboard")
    public Map<String,Object> createHospitalAccount(@RequestBody HospitalDataRequest hospitalDataRequest) {
        return ResponseEntity.status(HttpStatus.CREATED.value()).body(hospitalService.createHospitalAccount(hospitalDataRequest))
                .getBody();
    }

    @GetMapping("/data/{hospitalEmail}")
    public HospitalDataRequest getHospitalDataByEmail(@PathVariable String hospitalEmail) {
        return ResponseEntity.ok().body(hospitalService.
                getHospitalByEmail(hospitalEmail)).getBody();
    }
}
