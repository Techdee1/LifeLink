package org.interswitch.app.LifeLink.configuration.principals;

import org.interswitch.app.LifeLink.model.Hospital;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class HospitalPrincipal implements UserDetails {

    private Hospital hospital;

    public HospitalPrincipal(Hospital hospital) {
        this.hospital = hospital;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }

    @Override
    public @Nullable String getPassword() {
        return hospital.getAccountPassword();
    }

    @Override
    public String getUsername() {
        return hospital.getHospitalEmail();
    }
}
