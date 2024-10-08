package com.createwad.wad_backend.dto;

public class VerifyCodeRequest {
    private String username;
    private String code;

    // 생성자
    public VerifyCodeRequest(String username, String code) {
        this.username = username;
        this.code = code;
    }

    // 게터와 세터
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
