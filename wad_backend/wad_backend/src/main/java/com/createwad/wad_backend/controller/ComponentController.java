package com.createwad.wad_backend.controller;

import com.createwad.wad_backend.domain.ComponentCollection;
import com.createwad.wad_backend.domain.ComponentInfo;
import com.createwad.wad_backend.domain.GeneratedCodes;
import com.createwad.wad_backend.repository.GeneratedCodesRepository;
import com.createwad.wad_backend.service.ComponentService;
import com.createwad.wad_backend.service.GptApiService;
import com.createwad.wad_backend.service.StackOverflowCrawlService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/component")
public class ComponentController {

    private static final Logger logger = LoggerFactory.getLogger(ComponentController.class);

    @Autowired
    private ComponentService componentService;
    @Autowired
    private GptApiService gptApiService;
    @Autowired
    private GeneratedCodesRepository generatedCodesRepository;
    @Autowired
    private StackOverflowCrawlService stackOverflowCrawlService;

    private String currentStatus = ""; // 현재 상태를 저장하는 변수

    @GetMapping
    public List<ComponentInfo> getAllComponents() {
        return componentService.getAllComponents();
    }

    @PostMapping("/execute-all")
    public String executeAllOperations(@RequestBody ComponentInfo componentInfo) {
        currentStatus = "";
        currentStatus = "컴포넌트 저장중..";
        componentService.saveComponent(componentInfo);
        logger.info("Component saved successfully for projectId: {}", componentInfo.getProjectId());
        currentStatus = "프레임워크에 대한 유사 코드 크롤링중..";

        String projectId = componentInfo.getProjectId();
        if (projectId != null && !projectId.isEmpty()) {
            stackOverflowCrawlService.crawlStackOverflowQuestions(projectId);
            logger.info("StackOverflow crawling started for projectId: {}", projectId);
        } else {
            logger.warn("Incomplete request. projectId must be provided.");
            currentStatus = "ERROR_INCOMPLETE_REQUEST";
            return "Incomplete request. Please provide projectId.";
        }

        currentStatus = "코드 생성중";
        ComponentCollection collection = new ComponentCollection();
        List<ComponentInfo> componentInfoList = new ArrayList<>();
        componentInfoList.add(componentInfo);
        collection.setCompInfo(componentInfoList);

        String generatedCode = gptApiService.requestGeneratedCode(collection);
        logger.info("Code generation completed for projectId: {}", projectId);

        GeneratedCodes generatedCodes = new GeneratedCodes();
        generatedCodes.setCode(generatedCode);
        generatedCodesRepository.save(generatedCodes);
        logger.info("Generated code saved for projectId: {}", projectId);

        currentStatus = "PROCESS_COMPLETED";
        return generatedCode;
    }

    @GetMapping("/status")
    public String getStatus() {
        return currentStatus; // 현재 상태 반환
    }
}
