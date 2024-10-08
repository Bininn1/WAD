package com.createwad.wad_backend.dto;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class FindIdRequest {
    private String name;
    private String phoneNumber;

    private LocalDate birthdate; // java.time.LocalDate로 변경
    private FindIdRequest request;
    public String getName() {
        return name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }


    // getters and setters
}
