package org.interswitch.app.LifeLink.repository;

import org.interswitch.app.LifeLink.model.VirtualAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VirtualAccountRepository extends JpaRepository<VirtualAccount, Long> {

    Optional<VirtualAccount> findByPatientName(String patientName);
}
