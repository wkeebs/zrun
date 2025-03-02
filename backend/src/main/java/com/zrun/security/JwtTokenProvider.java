package com.zrun.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import com.zrun.exception.JwtAuthenticationException;
import com.zrun.model.User;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    private final JwtConfig jwtConfig;

    // Create a secure key from the configured secret
    private SecretKey getSigningKey() {
        // Convert the secret string to bytes
        byte[] keyBytes = jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8);

        // Generate a secure key that's suitable for HS512
        // If the provided key is too short, it will be safely padded
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtConfig.getExpiration());

        try {
            return Jwts.builder()
                    .setSubject(userPrincipal.getId())
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    // Use the secure key with HS512
                    .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                    .compact();
        } catch (Exception e) {
            log.error("Error generating JWT token", e);
            throw new JwtAuthenticationException("Could not generate token");
        }
    }

    // New helper method to generate token directly from User entity
    public String generateToken(User user) {
        // Create UserPrincipal from User
        UserPrincipal userPrincipal = UserPrincipal.build(user);

        // Create Authentication object
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal,
                null,
                userPrincipal.getAuthorities());

        return generateToken(authentication);
    }

    public String getUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject();
        } catch (Exception e) {
            log.error("Error extracting user ID from token", e);
            throw new JwtAuthenticationException("Could not extract user ID from token");
        }
    }

    /**
     * Get user email from JWT token
     */
    public String getUserEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            log.error("Invalid JWT signature", e);
            throw new JwtAuthenticationException("Invalid JWT signature");
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token", e);
            throw new JwtAuthenticationException("Invalid JWT token");
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token", e);
            throw new JwtAuthenticationException("Expired JWT token");
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token", e);
            throw new JwtAuthenticationException("Unsupported JWT token");
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty", e);
            throw new JwtAuthenticationException("JWT claims string is empty");
        }
    }
}