package com.createwad.wad_backend.repository;

import com.createwad.wad_backend.domain.ComponentInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ComponentRepository extends MongoRepository<ComponentInfo, String> {
    // MongoDB와 연동할 수 있는 기본 CRUD 메서드 제공
}
