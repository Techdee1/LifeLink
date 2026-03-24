package org.interswitch.app.LifeLink.service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.interswitch.app.LifeLink.model.Hospital;
import org.interswitch.app.LifeLink.request.HospitalDataRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {

    private String secretKey;

    public JwtService() {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");
            SecretKey key = keyGenerator.generateKey();
            secretKey = Base64.getEncoder().encodeToString(key.getEncoded());
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public SecretKey getKey() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKey));
    }

    public Map<String,Object> createAccessKey(Hospital hospital) {
        Map<String,Object> claims = new HashMap<>();
        long expiration = 5 * 60 * 1000; // 5 minutes
        Date issued = new Date(System.currentTimeMillis());
        Date expiration_date = new Date(System.currentTimeMillis() + expiration);
        String access_token = Jwts.builder()
                .claims(claims)
                .subject(hospital.getHospitalEmail())
                .issuedAt(issued)
                .expiration(expiration_date)
                .signWith(getKey())
                .compact();
        return Map.of("access_token", access_token, "issued",issued, "expiration", expiration_date);
    }

    public Map<String,Object> createRefreshKey(Hospital hospital) {
        Map<String,Object> claims = new HashMap<>();
        long expiration = 7 * 24 * 60 * 60 * 1000; // 7 days
        Date issued = new Date(System.currentTimeMillis());
        Date expiration_date = new Date(System.currentTimeMillis() + expiration);
        String refresh_token = Jwts.builder()
                .claims(claims)
                .subject(hospital.getHospitalEmail())
                .issuedAt(issued)
                .expiration(expiration_date)
                .signWith(getKey())
                .compact();
        return Map.of("refresh_token", refresh_token, "issued",issued, "expiration", expiration_date);
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T>T extractAllClaims(String token, Function<Claims,T> claimsResolver) {
        Claims claims = extractClaims(token);
        return claimsResolver.apply(claims);
    }

    public String getEmail(String token) {
        return extractAllClaims(token, Claims::getSubject);
    }

    public boolean checkExpiration(String token) {
        Date expiration = extractAllClaims(token,Claims::getExpiration);
        Date current = new Date(System.currentTimeMillis());
        return expiration.before(current);
    }

    public boolean validateHospital(String hospitalEmail, UserDetails userDetails) {
        return Objects.equals(userDetails.getUsername(), hospitalEmail);
    }
}
