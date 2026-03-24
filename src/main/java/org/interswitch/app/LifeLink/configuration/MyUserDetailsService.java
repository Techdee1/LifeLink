package org.interswitch.app.LifeLink.configuration;

import org.interswitch.app.LifeLink.configuration.principals.HospitalPrincipal;
import org.interswitch.app.LifeLink.model.Hospital;
import org.interswitch.app.LifeLink.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private HospitalRepository hospitalRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Hospital hospital = hospitalRepository.findByHospitalEmail(email)
                .orElseThrow(() -> new RuntimeException("Hospital data not found"));
        return new HospitalPrincipal(hospital);
    }
}
