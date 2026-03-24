package org.interswitch.app.LifeLink.repository;

import org.interswitch.app.LifeLink.model.HospitalAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HospitalAccountRepository extends JpaRepository<HospitalAccount, UUID> {
}
