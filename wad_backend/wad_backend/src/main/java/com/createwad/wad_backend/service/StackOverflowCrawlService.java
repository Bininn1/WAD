package com.createwad.wad_backend.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class StackOverflowCrawlService {
    private static final Logger logger = LoggerFactory.getLogger(StackOverflowCrawlService.class);

    @Autowired
    private MongoDBService mongoDBService;

    public void crawlStackOverflowQuestions(String projectId) {
        try {
            logger.info("Stack Overflow 크롤링 시작: {}", projectId);

            int page = 1; // 페이지 번호
            int allpage = 15;
            boolean foundAcceptedAnswer = false; // 채택된 답변을 찾았는지 여부

            while (!foundAcceptedAnswer) {
                String url = "https://stackoverflow.com/questions/tagged/" + projectId + "?tab=newest&page=" + page + allpage;
                Document document = Jsoup.connect(url)
                        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36")
                        .get();

                Elements questionElements = document.select("div.s-post-summary--content > h3 > a");

                for (Element question : questionElements) {
                    String questionUrl = "https://stackoverflow.com" + question.attr("href");
                    logger.info("질문 URL: {}", questionUrl);

                    Document questionDocument = Jsoup.connect(questionUrl)
                            .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36")
                            .get();

                    Element acceptedAnswerDiv = questionDocument.selectFirst("div.answer.accepted-answer");

                    if (acceptedAnswerDiv != null) {
                        Elements codeElements = acceptedAnswerDiv.select("code");
                        if (!codeElements.isEmpty()) {
                            StringBuilder combinedCode = new StringBuilder();
                            codeElements.forEach(codeElement -> {
                                String code = codeElement.text();
                                combinedCode.append(code).append("\n");
                            });

                            saveCrawledData(questionUrl, combinedCode.toString(), projectId);
                            logger.info("크롤링한 코드 저장 성공.");
                            foundAcceptedAnswer = true;
                            break; // 채택된 답변을 찾으면 루프 종료
                        }
                    }
                }

                if (!foundAcceptedAnswer) {
                    if(page == 15){
                        allpage = allpage + 15;
                    }
                    else {
                        page++; // 채택된 답변을 찾지 못했으면 다음 페이지로 이동
                        logger.info("다음 페이지로 이동: 페이지 {}", page); // 페이지가 증가했음을 로그로 출력
                    }

                }
            }

        } catch (Exception e) {
            logger.error("Stack Overflow 검색 중 오류 발생: ", e);
        }
    }

    // 웹 크롤링 결과를 MongoDB에 저장하는 메서드
    public void saveCrawledData(String url, String content, String projectId) {
        // MongoDBService를 사용하여 데이터 저장
        mongoDBService.saveCrawledData(url, content, projectId);
    }
}
