package com.createwad.wad_backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class VerificationCode {
    @Id
    private String email;
    private String code;

    public VerificationCode() {
    }

    public VerificationCode(String email, String code) {
        this.email = email;
        this.code = code;
    }
    public String getCode() {
        return code;
    }


    // getters, setters
}
