package org.interswitch.app.LifeLink.repository;

import org.interswitch.app.LifeLink.model.Case;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRepository extends JpaRepository<Case,Long> {
}
