package com.createwad.wad_backend.repository;

import com.createwad.wad_backend.domain.GeneratedCodes;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface GeneratedCodesRepository extends MongoRepository<GeneratedCodes, String> {
    // 필요한 쿼리 메소드를 여기에 추가할 수 있습니다.
}
