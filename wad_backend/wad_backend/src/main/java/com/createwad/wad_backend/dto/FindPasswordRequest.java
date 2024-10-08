package com.createwad.wad_backend.dto;

public class FindPasswordRequest {
    private String username;
    private String email;

    // 생성자
    public FindPasswordRequest(String username, String email) {
        this.username = username;
        this.email = email;
    }

    // 게터와 세터
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
