package com.zrun.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String name;

    @Builder.Default
    private List<Role> roles = new ArrayList<>();

    @Builder.Default
    private boolean enabled = true;

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }
}