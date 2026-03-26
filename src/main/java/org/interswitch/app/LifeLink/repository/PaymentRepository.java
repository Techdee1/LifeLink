package org.interswitch.app.LifeLink.repository;

import org.interswitch.app.LifeLink.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment,Long> {

    List<Payment> findByAccountName(String accountName);
}
