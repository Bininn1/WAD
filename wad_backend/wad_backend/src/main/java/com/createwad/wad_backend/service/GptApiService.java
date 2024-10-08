package com.createwad.wad_backend.service;

import com.createwad.wad_backend.domain.ComponentCollection;
import com.createwad.wad_backend.domain.ComponentDetail;
import com.createwad.wad_backend.domain.ComponentInfo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Field;
import java.util.List;

@Service
public class GptApiService {

    private static final Logger logger = LoggerFactory.getLogger(GptApiService.class);

    @Value("${gpt.api.endpoint}")
    private String gptApiEndpoint;

    @Value("${gpt.api.key}")
    private String apiKey;
    private final RestTemplate restTemplate;

    @Autowired
    public GptApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    // ComponentCollection 인자를 받아서 JSON을 생성하는 메서드를 추가합니다.
    private ObjectNode generateGptRequestBody(ComponentCollection componentCollection) {
        ObjectMapper objectMapper = new ObjectMapper();

        ObjectNode mainNode = objectMapper.createObjectNode();
        mainNode.put("model", "gpt-4");

        ArrayNode messagesNode = objectMapper.createArrayNode();

        ObjectNode systemNode = objectMapper.createObjectNode();
        systemNode.put("role", "system");
        // ComponentCollection에서 ComponentInfo의 리스트를 가져옵니다.
        List<ComponentInfo> componentInfoList = componentCollection.getCompInfo();

        if (componentInfoList == null || componentInfoList.isEmpty()) {
            logger.error("ComponentInfo list is empty or null.");
            throw new IllegalArgumentException("ComponentInfo list must not be empty or null.");
        }

        // 첫 번째 ComponentInfo 객체(또는 필요한 특정 객체)를 사용하여 generateGptContent를 호출합니다.
        systemNode.put("content", generateGptContent(componentInfoList.get(0)));


        messagesNode.add(systemNode);

        mainNode.set("messages", messagesNode);
        mainNode.put("temperature", 1);
        mainNode.put("max_tokens", 256);
        mainNode.put("top_p", 1);
        mainNode.put("frequency_penalty", 0);
        mainNode.put("presence_penalty", 0);

        return mainNode;
    }

    private String generateGptContent(ComponentInfo componentInfo) {

        StringBuilder contentBuilder = new StringBuilder(" Reply only executable code, no comments. Put the style as an inline declaration. Generate an executable complete code for the following component based on the\n");
        contentBuilder.append("\"framework\": \"").append(componentInfo.getFramework()).append("\",\n");
        contentBuilder.append("\"compInfo\": [\n");

        for (ComponentDetail detail : componentInfo.getCompInfo()) {
            if (detail.getCss() == null) {
                continue; // 또는 적절한 기본값 설정
            }
            contentBuilder.append("{\n");
            contentBuilder.append("\"componentName\": \"").append(detail.getComponentName()).append("\",\n");
            contentBuilder.append("\"left\":\"").append(detail.getLeft()).append("\",\n");
            contentBuilder.append("\"top\":\"").append(detail.getTop()).append("\",\n");
            contentBuilder.append("\"width\":\"").append(detail.getWidth()).append("\",\n");
            contentBuilder.append("\"height\":\"").append(detail.getHeight()).append("\",\n");
            contentBuilder.append("\"css\": {\n");
            for (Field field : detail.getCss().getClass().getDeclaredFields()) {
                field.setAccessible(true);
                try {
                    Object value = field.get(detail.getCss());
                    if (value != null) {
                        contentBuilder.append("\"").append(field.getName()).append("\": \"").append(value).append("\",\n");
                    } else {
                        contentBuilder.append("\"").append(field.getName()).append("\": null,\n");
                    }
                } catch (IllegalAccessException e) {
                    logger.error("Access to the field is denied.", e);
                }
            }
            contentBuilder.setLength(contentBuilder.length() - 2);  // 마지막 ','를 제거
            contentBuilder.append("}\n},\n");
        }
        contentBuilder.setLength(contentBuilder.length() - 2);  // 마지막 ','를 제거
        contentBuilder.append("]\n");

        return contentBuilder.toString();
    }


    public String requestGeneratedCode(ComponentCollection componentCollection) {
        logger.info("requestGeneratedCode  method started.");

        // ObjectNode에서 String으로 변환
        String requestBodyStr = generateGptRequestBody(componentCollection).toString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<String> entity = new HttpEntity<>(requestBodyStr, headers);

        ResponseEntity<String> responseEntity = restTemplate.postForEntity(gptApiEndpoint, entity, String.class);
        logger.info("Received response from GPT API: " + responseEntity.getBody());

        String generatedCode = extractCodeFromGptResponse(responseEntity.getBody());

        logger.info("Extracted generated code: " + generatedCode);
        logger.info("requestGeneratedCode method finished.");

        return generatedCode;
    }



    private String extractCodeFromGptResponse(String response) {
        logger.info("Extracting code from GPT response.");
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response);
            // "choices[0].message.content" 경로로 코드를 찾습니다.
            String code = rootNode.path("choices").get(0).path("message").path("content").asText().trim();
            logger.info("Extracted code: " + code);
            return code;
        } catch (Exception e) {
            logger.error("Error extracting code from GPT response.", e);
            return "";
        }
    }

}
