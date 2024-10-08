package com.createwad.wad_backend.dto;

public class ResetPasswordRequest {
    private String name; // 이름으로 변경
    private String email; // 이메일 추가
    private String newPassword; // 새 비밀번호로 변경

    // 생성자
    public ResetPasswordRequest(String name, String email, String newPassword) {
        this.name = name;
        this.email = email;
        this.newPassword = newPassword;
    }

    // 게터와 세터
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
