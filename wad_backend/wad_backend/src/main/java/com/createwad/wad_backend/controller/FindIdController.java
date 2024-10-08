package com.createwad.wad_backend.controller;

import com.createwad.wad_backend.service.FindIdService;
import com.createwad.wad_backend.dto.FindIdRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


import java.util.Collections;

@RestController
public class FindIdController {

    @Autowired
    private FindIdService findIdService;

    @PostMapping("/findId")
    public ResponseEntity<?> findId(@RequestBody FindIdRequest request) {
        try {
            String email = findIdService.findId((String) request.getName(), (String) request.getPhoneNumber());
            return new ResponseEntity<>(Collections.singletonMap("email", email), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 추가적인 클래스와 메서드
}
