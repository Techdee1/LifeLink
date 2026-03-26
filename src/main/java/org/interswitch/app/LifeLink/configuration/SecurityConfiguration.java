package org.interswitch.app.LifeLink.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.interswitch.app.LifeLink.configuration.principals.HospitalPrincipal;
import org.interswitch.app.LifeLink.filter.AuthFilter;
import org.interswitch.app.LifeLink.filter.JwtFilter;
import org.interswitch.app.LifeLink.model.Hospital;
import org.interswitch.app.LifeLink.repository.HospitalRepository;
import org.interswitch.app.LifeLink.service.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private MyUserDetailsService myUserDetailsService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private HospitalRepository hospitalRepository;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private JwtFilter jwtFilter;
        private final static String[] publicUrls = {
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/webjars/**",
            "/favicon.ico",
            "/actuator/**",
            "/error"
    };


    @Bean
    public UserDetailsService userDetailsService() {
        return myUserDetailsService;
    }

    @Bean
    public PasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider(userDetailsService());
        daoAuthenticationProvider.setPasswordEncoder(getPasswordEncoder());
        return daoAuthenticationProvider;
    }

    @Bean
    public AuthFilter authFilter(AuthenticationManager authenticationManager) {
        AuthFilter authFilter = new AuthFilter();
        authFilter.setFilterProcessesUrl("/api/v1/lifelink/hospitals/auth/login");
        authFilter.setAuthenticationManager(authenticationManager);
        authFilter.setAuthenticationSuccessHandler((request, response, authentication) -> {
            response.setStatus(HttpServletResponse.SC_OK);
            HospitalPrincipal hospitalPrincipal = (HospitalPrincipal) authentication.getPrincipal();
            if(hospitalPrincipal == null) {
                throw  new RuntimeException("Hospital not authenticated");
            }
            Hospital hospital = hospitalRepository.
                    findByHospitalEmail(hospitalPrincipal.getUsername())
                    .orElseThrow(() -> new RuntimeException("Hospital not found"));

            Map<String,Object> accessToken = jwtService.createAccessKey(hospital);
            Map<String,Object> refreshToken = jwtService.createRefreshKey(hospital);

            response.getWriter().write(objectMapper.writeValueAsString(Map.of("access", accessToken, "refresh", refreshToken, "hospitalId", hospital.getId())));
        });

        authFilter.setAuthenticationFailureHandler((request, response, exception) -> {
            response.setStatus(response.getStatus());
            response.getWriter().write(objectMapper.writeValueAsString(Map.
                    of("status", response.getStatus(), "message", "unauthenticated")));
        });
        return authFilter;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfiguration() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedMethods(List.of("POST","GET","DELETE","PUT", "OPTIONS"));
        corsConfiguration.setAllowedHeaders(List.of("*"));
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173"));
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);

        return urlBasedCorsConfigurationSource;
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity, AuthenticationManager authenticationManager) {
        return httpSecurity.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfiguration()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(requests -> requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST,
                    "/api/v1/lifelink/hospitals/auth/onboard",
                    "/api/v1/lifelink/hospitals/auth/login",
                    "/api/v1/lifelink/hospitals/auth/refresh",
                    "/api/v1/lifelink/cases/webhook",
                    "/api/v1/lifelink/ai/chat")
                .permitAll()
                .requestMatchers(publicUrls).permitAll()
                .anyRequest().authenticated())
                .addFilterAt(authFilter(authenticationManager), UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(jwtFilter,UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
