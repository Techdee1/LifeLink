package org.interswitch.app.LifeLink.repository;

import org.interswitch.app.LifeLink.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    @Query("SELECT COALESCE(SUM(p.bridgedAmount), 0) FROM Loan p")
    BigDecimal findSumBridgedAmount();
}
