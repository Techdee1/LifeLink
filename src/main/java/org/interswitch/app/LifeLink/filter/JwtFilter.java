package org.interswitch.app.LifeLink.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.interswitch.app.LifeLink.configuration.MyUserDetailsService;
import org.interswitch.app.LifeLink.service.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private static final List<String> PUBLIC_PATH_PREFIXES = List.of(
            "/api/v1/lifelink/hospitals/auth/",
            "/api/v1/lifelink/cases/webhook",
            "/api/v1/lifelink/ai/chat",
            "/swagger-ui",
            "/v3/api-docs",
            "/webjars",
            "/actuator",
            "/favicon.ico",
            "/error"
    );

    @Autowired
    private JwtService jwtService;
    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return PUBLIC_PATH_PREFIXES.stream().anyMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        String token = null;
        String email = null;
        if(header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            email = jwtService.getEmail(token);

            if(email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = myUserDetailsService.loadUserByUsername(email);
                System.out.println("Hello");
                //check for expiration and validate user
                if(!jwtService.checkExpiration(token) && jwtService.validateHospital(email,userDetails)) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails.getUsername(), null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

                    log.info("User authenticated....");
                }
            }
        }
        filterChain.doFilter(request,response);
    }
}
