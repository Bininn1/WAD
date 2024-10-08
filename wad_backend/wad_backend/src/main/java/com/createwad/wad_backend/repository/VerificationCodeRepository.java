package com.createwad.wad_backend.repository;

import com.createwad.wad_backend.domain.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, String> {
    VerificationCode findByEmail(String email);
}
