package com.createwad.wad_backend.repository;

import com.createwad.wad_backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
    User findByNameAndEmail(String name, String email); // 이름과 이메일로 사용자 찾기

    User findByNameAndPhoneNumber(String name, String phoneNumber);
}