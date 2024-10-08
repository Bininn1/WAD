package com.createwad.wad_backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MongoDBService {
    private static final Logger logger = LoggerFactory.getLogger(MongoDBService.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<String> getAllUrlsByProjectId(String collectionName, String projectId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("projectId").is(projectId));
        query.with(Sort.by(Sort.Direction.DESC, "timestamp"));  // timestamp 필드를 기준으로 내림차순 정렬

        List<Map> documents = mongoTemplate.find(query, Map.class, collectionName);
        List<String> urls = new ArrayList<>();

        for (Map<String, Object> document : documents) {
            if (document.containsKey("url")) {
                urls.add((String) document.get("url"));
            }
        }
        return urls;
    }

    public String getLatestUpdateDate() {
        Query query = new Query();
        query.addCriteria(Criteria.where("projectId").is("React-official")); // React-official에 대한 최신 업데이트 날짜 조회
        query.with(Sort.by(Sort.Direction.DESC, "updateDate")); // updateDate 필드를 기준으로 내림차순 정렬
        Map<String, Object> document = mongoTemplate.findOne(query, Map.class, "wad_mongo");

        if (document != null && document.containsKey("updateDate")) {
            Object updateDateObj = document.get("updateDate");

            // updateDateObj가 Date 타입인지 확인
            if (updateDateObj instanceof Date) {
                Date updateDate = (Date) updateDateObj;
                logger.info("최신 업데이트 날짜: " + updateDate.toString());  // 최신 업데이트 날짜 로깅
                return updateDate.toString();
            } else if (updateDateObj instanceof String) {
                // 여기서 필요하다면 String을 Date로 변환할 수 있습니다.
                // 예: SimpleDateFormat을 사용하는 등의 작업을 할 수 있습니다.
                logger.info("최신 업데이트 날짜(String 형식): " + updateDateObj.toString());  // 최신 업데이트 날짜 로깅
                return updateDateObj.toString();
            } else {
                logger.warn("updateDate 필드의 타입이 예상과 다릅니다: " + updateDateObj.getClass().getName());
                return "";
            }

        } else {
            logger.warn("최신 업데이트 날짜를 찾을 수 없습니다.");
            return "";
        }
    }

    // 다른 메서드와 동일한 위치에 saveUrlToMongoDB 메서드 추가
    public void saveUrlToMongoDB(String url, String projectId, String updateDate) {
        // MongoDB에 저장할 문서 생성
        Map<String, Object> document = new HashMap<>();
        document.put("url", url);
        document.put("projectId", projectId);
        document.put("updateDate", updateDate);

        // MongoDB에 문서 저장
        mongoTemplate.save(document, "wad_mongo");
        logger.info("URL을 MongoDB에 저장했습니다. URL: {}, projectId: {}", url, projectId);
    }
    // crawled_stack 컬렉션에 데이터를 저장하는 메서드
    public void saveCrawledData(String url, String content, String projectId) {
        // MongoDB에 저장할 문서 생성
        Map<String, Object> document = new HashMap<>();
        document.put("url", url);
        document.put("content", content);  // 크롤링한 내용 저장
        document.put("projectId", projectId);

        // crawled_stack 컬렉션에 문서 저장
        mongoTemplate.save(document, "crawled_stack");
        logger.info("크롤링 데이터를 MongoDB에 저장했습니다. URL: {}, projectId: {}", url, projectId);
    }
}
