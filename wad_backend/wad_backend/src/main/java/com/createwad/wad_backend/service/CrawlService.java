package com.createwad.wad_backend.service;

import com.createwad.wad_backend.domain.CrawledProject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CrawlService {
    private static final Logger logger = LoggerFactory.getLogger(CrawlService.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    // Method to perform web crawling and save the results to MongoDB
    public void crawlAndSave(String url, String projectId) {
        logger.info("crawlAndSave 메서드 호출. projectId: {}, url: {}", projectId, url);

        // If the URL is not empty, perform crawling
        if (!url.isEmpty()) {
            try {
                // Connect to the web page
                Document document = Jsoup.connect(url)
                        .userAgent("Mozilla/5.0")
                        .get();

                // Find the div with "answer" class. This class name should be aligned with the actual page.
                Elements answerDivs = document.select("div.answer");

                // Iterate over each "answer" div
                for (Element div : answerDivs) {
                    // Check if the itemprop attribute is "acceptedAnswer"
                    String itemprop = div.attr("itemprop");
                    if ("acceptedAnswer".equals(itemprop)) {
                        // Here, crawl the code part of the accepted answer
                        Elements codeElements = div.select("code");

                        // Check if any code tags were found
                        if (codeElements.isEmpty()) {
                            logger.warn("코드 태그를 찾을 수 없습니다.");
                        } else {
                            StringBuilder combinedCode = new StringBuilder();
                            // Extract and accumulate code from each code element
                            codeElements.forEach(codeElement -> {
                                String code = codeElement.text();
                                combinedCode.append(code).append("\n");  // Add a new line
                            });

                            // Create a CrawledProject object and set its attributes
                            CrawledProject project = new CrawledProject();
                            project.setCode(combinedCode.toString());
                            project.setProjectId(projectId);

                            // Save the accumulated code and update date to MongoDB
                            mongoTemplate.save(project, "crawled_projects");
                            logger.info("크롤링한 코드 저장 성공.");
                        }
                    }
                }
            } catch (Exception e) {
                logger.error("크롤링 중 예외 발생: ", e);
            }
        } else {
            logger.warn("URL이 비어 있습니다.");
        }
    }
}
