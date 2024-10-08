package com.createwad.wad_backend.controller;

import com.createwad.wad_backend.service.CrawlService;
import com.createwad.wad_backend.service.MongoDBService;
import com.createwad.wad_backend.service.UpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crawl")
public class CrawlController {
    @Autowired
    private CrawlService crawlService;
    @Autowired
    private MongoDBService mongoDBService;
    @Autowired
    private UpdateService updateService;
    private static final Logger logger = LoggerFactory.getLogger(CrawlController.class);

    @GetMapping("/getUrl")
    public List<String> getUrls(@RequestParam String projectId) {
        List<String> urls = mongoDBService.getAllUrlsByProjectId("wad_mongo", projectId);

        if (!urls.isEmpty()) {
            logger.info("Found {} URLs for projectId: {}", urls.size(), projectId);
            return urls;
        } else {
            logger.warn("URLs not found for projectId: {}", projectId);
            return Collections.emptyList();
        }
    }

    @PostMapping("/start")
    public String startCrawling(@RequestBody Map<String, String> payload) {
        String projectId = payload.get("projectId");  // JSON에서 projectId를 추출
        String url = payload.get("url");  // JSON에서 url을 추출

        if (projectId != null && url != null && !projectId.isEmpty() && !url.isEmpty()) {
            logger.info("Starting crawling for projectId {}: {}", projectId, url);
            crawlService.crawlAndSave(url, projectId);  // 크롤링 메서드 호출
            return "Crawling and saving completed for projectId: " + projectId;
        } else {
            logger.warn("Incomplete request. projectId and url must be provided.");
            return "Incomplete request. Please provide both projectId and url.";
        }
    }

    @PostMapping("/update")
    public String updateCrawledData() {
        logger.info("Updating crawled data...");

        // UpdateService를 사용하여 최신 업데이트 URL을 가져오고 MongoDB에 저장
        updateService.updateLatestUrl();

        return "Crawled data updated.";
    }

}
