package com.createwad.wad_backend.repository;

import com.createwad.wad_backend.domain.CrawledProject;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CrawledProjectRepository extends MongoRepository<CrawledProject, String> {
}
