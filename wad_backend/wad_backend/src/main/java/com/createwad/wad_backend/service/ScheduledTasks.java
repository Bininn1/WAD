package com.createwad.wad_backend.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ScheduledTasks {
    @Autowired
    private UpdateService updateService; // UpdateService를 주입 받습니다.

    @Scheduled(fixedRate = 259200000) // 3일은 259,200,000 밀리세컨드
    public void updateCrawledDataPeriodically() {
        // POST 요청을 구성하는 로직
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        JSONObject json = new JSONObject();
        json.put("projectId", "React-official");
        HttpEntity<String> entity = new HttpEntity<>(json.toString(), headers);

        // POST 요청을 보내서 updateCrawledData 메소드를 실행시킵니다.
        // 이 부분에서는 "http://localhost:8080/update" URL이 서버의 업데이트 엔드포인트라고 가정하였습니다.
        restTemplate.postForObject("http://localhost:8080/api/crawl/update", entity, String.class);
    }
}
