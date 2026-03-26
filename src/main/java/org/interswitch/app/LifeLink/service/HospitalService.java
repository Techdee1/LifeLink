package org.interswitch.app.LifeLink.service;

import lombok.extern.slf4j.Slf4j;
import org.interswitch.app.LifeLink.mapper.HospitalMapper;
import org.interswitch.app.LifeLink.model.*;
import org.interswitch.app.LifeLink.pagination.CasePageRequest;
import org.interswitch.app.LifeLink.repository.*;
import org.interswitch.app.LifeLink.request.CaseRequest;
import org.interswitch.app.LifeLink.request.HospitalDataRequest;
import org.interswitch.app.LifeLink.request.VirtualAccountResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.*;

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
    private VirtualAccountRepository virtualAccountRepository;
    @Autowired
    private CaseRepository caseRepository;
    @Autowired
    private CasePageRequest casePageRequest;
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private PaymentRepository paymentRepository;

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

        // Cache is best-effort; API response should not fail when Redis is unavailable.
        try {
            redisTemplate.opsForValue().set(key, hospitalDataRequest, Duration.ofMinutes(5));
        } catch (RuntimeException e) {
            log.warn("Failed to cache hospital data for {}", hospitalEmail, e);
        }
        return hospitalDataRequest;
    }

    public Map<String,Object> createPatientCase(CaseRequest caseRequest) {
        //verify hospital id
        Hospital hospital = hospitalRepository.findById(caseRequest.getHId())
                .orElseThrow(() -> new RuntimeException("Hospital not found."));

        //create virtual account for patient case
        VirtualAccountResponse virtualAccountResponse = interswitchService.createVirtualAccount(caseRequest);
        if(caseRepository.findByPatientName(caseRequest.getPatientName().trim()).isPresent())
            throw new RuntimeException("Case already exists for patient.");

        Case user_case = getUserCase(caseRequest,hospital);

        VirtualAccount virtualAccount = getVirtualAccount(virtualAccountResponse, user_case);
        virtualAccountRepository.save(virtualAccount);
        log.info("virtual account details saved");

        return Map.of("caseId", user_case.getCaseId(),"bankCode", virtualAccountResponse.getBankCode(),
                "virtualAccountNumber", virtualAccountResponse.getAccountNumber(),
                "bankName", virtualAccountResponse.getBankName(),
                "accountName", virtualAccountResponse.getAccountName(), "status", user_case.getPatientCase());
    }

    public Map<String,Object> viewCaseProgress(Long caseId) {
        Case user_case = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found."));
        boolean is_bridge_eligible = false;
        VirtualAccount virtualAccount = virtualAccountRepository.
                findByPatientName(user_case.getPatientName()).orElseThrow(() -> new RuntimeException("account not found."));

        List<Payment> payments = paymentRepository.findByAccountName(virtualAccount.getAccountName());
        BigDecimal raisedAmount = payments.stream()
                .map(p -> p.getData().getAmount())
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal targetAmount = user_case.getDepositTarget();

        double percentage = (raisedAmount.doubleValue() / targetAmount.doubleValue()) * 100;
        is_bridge_eligible = (percentage > 60);

        return Map.of("patient", user_case.getPatientName(), "hospital", user_case.getHospital().getHospitalName()
        ,"raised_amount", raisedAmount.doubleValue(), "target_amount", targetAmount.doubleValue(), "percentage", percentage, "virtual_account", virtualAccount.getVirtualAccountNumber(), "is_bridge_eligible", is_bridge_eligible);
    }

    public Case getCaseById(Long caseId) {
        return caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found."));
    }

    public Hospital fetchByHospitalEmail(String hospitalEmail) {
        return hospitalRepository.findByHospitalEmail(hospitalEmail)
                .orElseThrow(() -> new RuntimeException("Hospital email not found"));
    }
    public void updateCaseProgress(Long caseId) {
        Case user_case = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found."));
        user_case.setPatientCase(PatientCase.CLOSED);
        caseRepository.save(user_case);
    }

    public List<VirtualAccount> fetchCompletedCase() {
        return virtualAccountRepository.findByStatus(PatientCase.OPEN);
    }

    public List<Case> fetchAllCases(int pageNo, int pageSize) {
        return caseRepository.findAll(casePageRequest.pageRequest(pageNo,pageSize))
                .stream().toList();
    }

    public Map<String ,Object> getDashboardData() {
         Map<String, Object> data = new HashMap<>();
         int activeCases = fetchCompletedCase().size();
         BigDecimal bridgeFunded = loanRepository.findSumBridgedAmount();
         long liveSaved = loanRepository.count();

         data.put("activeCases", activeCases);
         data.put("bridgedFunded", bridgeFunded);
         data.put("livesSaved", liveSaved);
         return data;
    }


    @NotNull
    private static VirtualAccount getVirtualAccount(VirtualAccountResponse virtualAccountResponse, Case user_case) {
        VirtualAccount virtualAccount = new VirtualAccount();
        virtualAccount.setPatientName(virtualAccountResponse.getAccountName());
        virtualAccount.setVirtualAccountNumber(virtualAccountResponse.getAccountNumber());
        virtualAccount.setBankName(virtualAccountResponse.getBankName());
        virtualAccount.setBankCode(virtualAccountResponse.getBankCode());
        virtualAccount.setCaseId(user_case.getCaseId());
        virtualAccount.setAccountName(virtualAccountResponse.getAccountName());
        BigDecimal raisedAmount = new BigDecimal(400000);
        virtualAccount.setRaisedAmount(raisedAmount);
        virtualAccount.setTargetAmount(user_case.getDepositTarget());
        double percentage = (raisedAmount.doubleValue() / user_case.getDepositTarget().doubleValue()) * 100;
        virtualAccount.setPercentage(percentage);
        virtualAccount.setStatus(PatientCase.OPEN);
        virtualAccount.setPatientEmail(user_case.getPatientEmail());
        return virtualAccount;
    }

    @NotNull
    public Case getUserCase(CaseRequest caseRequest, Hospital hospital) {
        Case user_case = new Case();
        user_case.setPatientEmail(caseRequest.getPatientEmail());
        user_case.setPatientName(caseRequest.getPatientName());
        user_case.setDepositTarget(caseRequest.getDepositTarget());
        user_case.setLeadKinName(caseRequest.getLeadKinName());
        user_case.setLeadKinPhone(caseRequest.getLeadKinPhone());
        user_case.setPatientCase(PatientCase.OPEN);
        user_case.setHospital(hospital);
        caseRepository.save(user_case);
        return user_case;
    }
}
