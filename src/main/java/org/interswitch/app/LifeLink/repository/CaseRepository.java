package org.interswitch.app.LifeLink.repository;

import org.interswitch.app.LifeLink.model.Case;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CaseRepository extends JpaRepository<Case,Long> {

    Optional<Case> findByPatientName(String patientName);
}
