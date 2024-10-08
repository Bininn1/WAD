package com.createwad.wad_backend.service;

import com.createwad.wad_backend.domain.User;
import com.createwad.wad_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class FindIdService {

    @Autowired
    private UserRepository userRepository;

    public String findId(String name, String phoneNumber) {
        User user = userRepository.findByNameAndPhoneNumber(name, phoneNumber);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with name and phone number");
        }
        return user.getEmail();
    }

    // 추가적인 메서드
}
