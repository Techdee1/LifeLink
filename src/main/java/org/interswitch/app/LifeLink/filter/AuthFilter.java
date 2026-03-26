package org.interswitch.app.LifeLink.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.interswitch.app.LifeLink.request.HospitalLoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class AuthFilter extends UsernamePasswordAuthenticationFilter {

    @Autowired
    private ObjectMapper objectMapper;
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            HospitalLoginRequest hospitalLoginRequest = objectMapper.readValue(request.getInputStream(), HospitalLoginRequest.class);
            if(hospitalLoginRequest.hospitalEmail() == null || hospitalLoginRequest.accountPassword() == null) {
                throw new BadCredentialsException("Invalid account details");
            }
            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(hospitalLoginRequest.hospitalEmail(),hospitalLoginRequest.accountPassword());
            setDetails(request,usernamePasswordAuthenticationToken);
            return this.getAuthenticationManager().authenticate(usernamePasswordAuthenticationToken);
        } catch (IOException e) {
            throw new AuthenticationServiceException("Invalid login payload", e);
        }
    }
}
