package org.interswitch.app.LifeLink.repository;

import org.interswitch.app.LifeLink.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface HospitalRepository extends JpaRepository<Hospital, UUID> {

    Optional<Hospital> findByHospitalEmail(String hospitalEmail);
}
