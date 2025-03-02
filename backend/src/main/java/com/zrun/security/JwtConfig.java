package com.zrun.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Component
@Getter
@Setter
public class JwtConfig {

    @Value("${zrun.security.jwt.secret}")
    private String secret;

    @Value("${zrun.security.jwt.expiration}")
    private long expiration;
}