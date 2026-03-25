package org.interswitch.app.LifeLink.repository;

import org.interswitch.app.LifeLink.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<Loan, Long> {
}
