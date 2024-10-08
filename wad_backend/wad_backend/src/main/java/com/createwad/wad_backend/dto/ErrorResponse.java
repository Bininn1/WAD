package com.createwad.wad_backend.dto;


import org.springframework.web.bind.annotation.ResponseBody;

@ResponseBody
public class ErrorResponse {
    private String message;

    public ErrorResponse(String message) {
        this.message = message;
    }

    // getter, setter
}
