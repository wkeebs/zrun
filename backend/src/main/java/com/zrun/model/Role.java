package com.zrun.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    ROLE_USER("ROLE_USER"),
    ROLE_ADMIN("ROLE_ADMIN");

    private final String authority;

    public static Role fromAuthority(String authority) {
        for (Role role : Role.values()) {
            if (role.getAuthority().equals(authority)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown authority: " + authority);
    }
}