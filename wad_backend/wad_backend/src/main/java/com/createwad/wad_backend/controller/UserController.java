package com.createwad.wad_backend.controller;

import com.createwad.wad_backend.dto.*;
import com.createwad.wad_backend.domain.User;
import com.createwad.wad_backend.domain.VerificationCode;  // 새로운 VerificationCode 모델 import
import com.createwad.wad_backend.repository.UserRepository;
import com.createwad.wad_backend.repository.VerificationCodeRepository;  // 새로운 repository import
import com.createwad.wad_backend.service.EmailService;
import com.createwad.wad_backend.service.UserService;
import com.createwad.wad_backend.dto.ErrorResponse;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
public class UserController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final EmailService emailService;
    @Autowired
    private VerificationCodeRepository verificationCodeRepository;
    private final UserService userService;
    SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    @Autowired
    public UserController(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, EmailService emailService, UserService userService) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.emailService = emailService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> signUp(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            return new ResponseEntity<>("Email already exists", HttpStatus.BAD_REQUEST);
        }
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setMembershipLevel(User.MembershipLevel.일반);
        userRepository.save(user);
        // 회원 가입시에는 이메일 인증 메일 전송 부분을 삭제하겠습니다.
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Email과 Password의 null 체크
        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("이메일 또는 비밀번호가 누락되었습니다."));
        }

        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user != null && bCryptPasswordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            // 토큰 생성
            String token = Jwts.builder()
                    .setSubject(user.getEmail())
                    .setExpiration(new Date(System.currentTimeMillis() + 864000000))
                    .signWith(SignatureAlgorithm.HS512, key)
                    .compact();
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(new LoginResponse(token, "Login successful"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("로그인 실패!"));
        }
    }

    @GetMapping("/getUserInfo")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String token) {

        String actualToken = token.substring(7);

        try {
            // 토큰 디코딩 및 email 추출
            String email = Jwts.parserBuilder().setSigningKey(key).build()
                    .parseClaimsJws(actualToken).getBody().getSubject();

            User user = userRepository.findByEmail(email);

            if (user == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(user, HttpStatus.OK);

        } catch (Exception e) {

            return new ResponseEntity<>("Invalid token", HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping("/updateUserInfo/{id}")
    public ResponseEntity<?> updateUserInfo(@PathVariable("id") int id,
                                            @RequestBody User updatedUser,
                                            @RequestHeader("Authorization") String token) {

        String actualToken = token.substring(7);

        try {
            // 토큰 디코딩 및 email 추출
            String email = Jwts.parserBuilder().setSigningKey(key).build()
                    .parseClaimsJws(actualToken).getBody().getSubject();

            User user = userRepository.findByEmail(email);

            if (user == null || user.getId() != id) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }

            User updated = userService.updateUserInfo(id, updatedUser);

            if (updated == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);

            }

            return new ResponseEntity<>("User info updated successfully", HttpStatus.OK);

        } catch (Exception e) {

            return new ResponseEntity<>("Invalid token", HttpStatus.UNAUTHORIZED);
        }
    }
}

