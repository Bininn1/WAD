package com.createwad.wad_backend.controller;

import com.createwad.wad_backend.service.StackOverflowCrawlService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.createwad.wad_backend.service.MongoDBService;
import java.util.Map;


@RestController
@RequestMapping("/api/crawl")
public class StackOverflowCrawlController {
    private static final Logger logger = LoggerFactory.getLogger(StackOverflowCrawlController.class);

    @Autowired
    private StackOverflowCrawlService stackOverflowCrawlService;

    @Autowired
    private MongoDBService mongoDBService;  // MongoDBService 추가

    @PostMapping("/stack-overflow")
    public String crawlStackOverflow(@RequestBody Map<String, String> payload) {
        String projectId = payload.get("projectId");  // JSON에서 projectId를 추출

        if (projectId != null && !projectId.isEmpty()) {
            logger.info("Starting StackOverflow crawling for projectId: {}", projectId);

            // 크롤링 서비스를 호출
            stackOverflowCrawlService.crawlStackOverflowQuestions(projectId);

            return "StackOverflow crawling started for projectId: " + projectId;
        } else {
            logger.warn("Incomplete request. projectId must be provided.");
            return "Incomplete request. Please provide projectId.";
        }
    }
}