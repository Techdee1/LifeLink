package org.interswitch.app.LifeLink.service;

import lombok.extern.slf4j.Slf4j;
import org.interswitch.app.LifeLink.mapper.CaseMapper;
import org.interswitch.app.LifeLink.mapper.HospitalMapper;
import org.interswitch.app.LifeLink.model.Case;
import org.interswitch.app.LifeLink.model.Hospital;
import org.interswitch.app.LifeLink.model.VirtualAccount;
import org.interswitch.app.LifeLink.repository.CaseRepository;
import org.interswitch.app.LifeLink.repository.HospitalAccountRepository;
import org.interswitch.app.LifeLink.repository.HospitalRepository;
import org.interswitch.app.LifeLink.repository.VirtualAccountRepository;
import org.interswitch.app.LifeLink.request.CaseRequest;
import org.interswitch.app.LifeLink.request.HospitalDataRequest;
import org.interswitch.app.LifeLink.request.VirtualAccountResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;

@Slf4j
@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;
    @Autowired
    private HospitalAccountRepository hospitalAccountRepository;
    @Autowired
    private HospitalMapper hospitalMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private InterswitchService interswitchService;
    @Autowired
    private CaseMapper caseMapper;
    @Autowired
    private VirtualAccountRepository virtualAccountRepository;
    @Autowired
    private CaseRepository caseRepository;

    public Map<String,Object> createHospitalAccount(HospitalDataRequest hospitalDataRequest) {
        Hospital hospital = hospitalMapper.convertRequestToModel(hospitalDataRequest);
        System.out.println(hospital.getSettlementAccount().getAccountId());
        hospital.setAccountPassword(passwordEncoder.encode(hospital.getAccountPassword()));

        hospitalAccountRepository.save(hospital.getSettlementAccount());
        log.info("hospital account details saved");
        hospitalRepository.save(hospital);
        log.info("Hospital Account created.");
        return Map.of("status","success", "hospital_id", hospital.getId(), "verified_name", hospital.getHospitalName()  , "message", "Hospital onboarded and account verified.");
    }

    public HospitalDataRequest getHospitalByEmail(String hospitalEmail) {
        String key = "hospital: ".concat(hospitalEmail);
        HospitalDataRequest hospitalDataRequest = hospitalRepository.findByHospitalEmail(hospitalEmail)
                .map(hospitalMapper::convertModelToRequest)
                .orElseThrow(() -> new RuntimeException("Hospital Account not found."));
        long expiry = (5 * 60) + System.currentTimeMillis();
        redisTemplate.opsForValue().set(key, hospitalDataRequest, Duration.ofMinutes(expiry));
        return hospitalDataRequest;
    }

    public Map<String,Object> createPatientCase(CaseRequest caseRequest) {
        //check if patient is available in the system
        //verify hospital id
        //create virtual account for patient case
        VirtualAccountResponse virtualAccountResponse = interswitchService.createVirtualAccount(caseRequest);
        Case user_case = caseMapper.convertToModel(caseRequest);
        caseRepository.save(user_case);

        VirtualAccount virtualAccount = getVirtualAccount(virtualAccountResponse, user_case);

        virtualAccountRepository.save(virtualAccount);
        log.info("virtual account details saved");

        return Map.of("bankCode", virtualAccountResponse.getBankCode(),
                "virtualAccountNumber", virtualAccountResponse.getAccountNumber(),
                "bankName", virtualAccountResponse.getBankName(),
                "accountName", virtualAccountResponse.getAccountName());
    }

    @NotNull
    private static VirtualAccount getVirtualAccount(VirtualAccountResponse virtualAccountResponse, Case user_case) {
        VirtualAccount virtualAccount = new VirtualAccount();
        virtualAccount.setAccountName(virtualAccountResponse.getAccountName());
        virtualAccount.setVirtualAccountNumber(virtualAccountResponse.getAccountNumber());
        virtualAccount.setBankName(virtualAccountResponse.getBankName());
        virtualAccount.setBankCode(virtualAccountResponse.getBankCode());
        virtualAccount.setCaseId(user_case.getCaseId());
        virtualAccount.setAccountName(virtualAccountResponse.getAccountName());
        return virtualAccount;
    }
}
