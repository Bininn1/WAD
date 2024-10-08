package com.createwad.wad_backend.controller;

import com.createwad.wad_backend.dto.EmailDTO;
import com.createwad.wad_backend.domain.User;
import com.createwad.wad_backend.domain.VerificationCode;
import com.createwad.wad_backend.repository.UserRepository;
import com.createwad.wad_backend.repository.VerificationCodeRepository;
import com.createwad.wad_backend.service.EmailService;
import com.createwad.wad_backend.dto.ResetPasswordRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class VerificationController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    public VerificationController(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }


    @PostMapping("/sendVerificationCode")
    public ResponseEntity<?> sendVerificationCode(@RequestBody EmailDTO emailDTO) {
        String email = emailDTO.getEmail();
        System.out.println("Received email: " + email);
        User user = userRepository.findByEmail(email);
        if (user != null) {
            return new ResponseEntity<>("Email already exists", HttpStatus.BAD_REQUEST);
        }

        try {
            String generatedCode = emailService.sendVerificationCode(new User(email));
            VerificationCode verificationCode = new VerificationCode(email, generatedCode);
            verificationCodeRepository.save(verificationCode);
            return new ResponseEntity<>("Verification code sent", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to send verification code", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/sendVerificationCodeForPasswordReset")
    public ResponseEntity<?> sendVerificationCodeForPasswordReset(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");

        User user = userRepository.findByNameAndEmail(name, email); // 이름과 이메일로 사용자 찾기

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.BAD_REQUEST);
        }

        try {
            String generatedCode = emailService.sendVerificationCode(user);
            VerificationCode verificationCode = new VerificationCode(email, generatedCode);
            verificationCodeRepository.save(verificationCode);
            return new ResponseEntity<>("Verification code sent", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to send verification code", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/verifyCode")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        VerificationCode storedCode = verificationCodeRepository.findByEmail(email);

        if (storedCode != null && storedCode.getCode().equals(code)) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        User user = userRepository.findByNameAndEmail(request.getName(), request.getEmail());

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.BAD_REQUEST);
        }
        user.setPassword(bCryptPasswordEncoder.encode(request.getNewPassword())); // 새 비밀번호로 변경
        userRepository.save(user);

        return new ResponseEntity<>("Password reset successful", HttpStatus.OK);
    }

}
