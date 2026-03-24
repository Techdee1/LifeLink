package org.interswitch.app.LifeLink.repository;

import org.interswitch.app.LifeLink.model.VirtualAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VirtualAccountRepository extends JpaRepository<VirtualAccount, Long> {
}
