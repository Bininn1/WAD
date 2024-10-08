package com.createwad.wad_backend.service;

import com.createwad.wad_backend.dto.ErrorResponse;
import com.createwad.wad_backend.dto.FindIdRequest;
import com.createwad.wad_backend.dto.FindIdResponse;
import com.createwad.wad_backend.domain.User;
import com.createwad.wad_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> findId(FindIdRequest findIdRequest) {
        User user = userRepository.findByNameAndPhoneNumber(
                findIdRequest.getName(),
                findIdRequest.getPhoneNumber()
        ); // 생년월일 인자를 제거했습니다.

        if (user != null) {
            String email = user.getEmail();
            String maskedEmail = email.substring(0, email.indexOf("@") - 5).replaceAll(".", "*") + email.substring(email.indexOf("@") - 5);
            return ResponseEntity.ok(new FindIdResponse(maskedEmail));
        } else {
            return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
        }
    }

    public User updateUserInfo(int id, User updatedUser) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return null;
        }

        existingUser.setName(updatedUser.getName());
        existingUser.setOccupation(updatedUser.getOccupation());
        existingUser.setPassword(updatedUser.getPassword());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());

        return userRepository.save(existingUser);
    }
}
