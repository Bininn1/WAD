package com.createwad.wad_backend.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

@Service
public class UpdateService {
    private static final Logger logger = LoggerFactory.getLogger(UpdateService.class);

    @Autowired
    private MongoDBService mongoDBService;
    @Autowired
    private CrawlService crawlService;
    // 문자열로부터 Date 객체를 생성하는 메소드
    public Date stringToDate(String dateStr) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return sdf.parse(dateStr);
        } catch (ParseException e) {
            logger.error("날짜 형식 변환 실패: {}", dateStr);
            return null;
        }
    }

    // 최신 URL과 날짜를 업데이트하는 메소드
    public void updateLatestUrl() {
        try {
            String url = "https://react.dev/blog";
            Document document = Jsoup.connect(url).get();
            Elements dateElements = document.select("div.flex.flex-row.justify-start.gap-2.items-center.text-base");

            String currentLatestUpdateDateStr = mongoDBService.getLatestUpdateDate();
            Date currentLatestUpdateDateObj = stringToDate(currentLatestUpdateDateStr);

            // 웹 페이지에서 가져온 날짜 정보와 비교하여 최신 URL과 날짜를 찾음
            Date latestUpdateDate = extractAndUpdateDateFromWebPage(dateElements);
            String latestUpdateUrl = updateLinksFromWebPage(dateElements, currentLatestUpdateDateObj);

            if (latestUpdateUrl != null && latestUpdateDate != null) {
                String updateDateStr = new SimpleDateFormat("yyyy-MM-dd").format(latestUpdateDate);

                // URL을 완성하는 부분
                String completeUrl = "https://react.dev" + latestUpdateUrl;

                mongoDBService.saveUrlToMongoDB(completeUrl, "React-official", updateDateStr);
                logger.info("최신 업데이트 URL과 날짜를 찾았습니다. URL: {}, 업데이트 날짜: {}", completeUrl, updateDateStr);


                // 업데이트가 완료된 후 URL 크롤링
                String updatedUrl = completeUrl;  // 실제로는 DB에서 가져오거나 다른 방식으로 가져와야 함
                String projectId = "React-official";  // 프로젝트 ID도 실제로는 어떤 방식으로든 얻어야 함
                crawlService.crawlAndSave(updatedUrl, projectId);
            } else {
                logger.warn("최신 업데이트 URL과 날짜를 찾을 수 없습니다.");
            }
        } catch (IOException e) {
            logger.error("URL 가져오기 중 예외 발생: ", e);
        }
    }

    // 웹 페이지에서 날짜 정보를 가져와 Date 객체로 반환하는 메소드
    public Date extractAndUpdateDateFromWebPage(Elements dateElements) {
        for (Element dateElement : dateElements) {
            String dateText = dateElement.text();
            String formattedDate = formatDate(dateText);
            Date formattedDateObj = stringToDate(formattedDate);

            if(formattedDateObj != null) {
                return formattedDateObj;  // MongoDB에 저장하는 것은 updateLatestUrl 메서드에서 수행
            }
        }
        return null;
    }

    // 웹 페이지에서 날짜 정보를 가져와 최신 URL을 찾는 메소드
    private String updateLinksFromWebPage(Elements dateElements, Date currentLatestUpdateDateObj) {
        String latestUpdateUrl = null;
        for (Element dateElement : dateElements) {
            String dateText = dateElement.text();
            String formattedDate = formatDate(dateText);
            Date formattedDateObj = stringToDate(formattedDate);

            if (formattedDateObj != null && currentLatestUpdateDateObj != null && formattedDateObj.after(currentLatestUpdateDateObj)) {
                Element anchorElement = dateElement.parents().select("a").first();
                if (anchorElement != null) {
                    latestUpdateUrl = anchorElement.attr("href");
                    break;
                } else {
                    logger.warn("앵커 요소를 찾을 수 없습니다.");
                }
            } else {
                logger.warn("더 새로운 날짜를 찾을 수 없습니다.");
            }
        }
        return latestUpdateUrl;
    }

    // 웹 페이지에서 가져온 날짜 정보를 "yyyy-MM-dd" 형식으로 변환하는 메소드
    private String formatDate(String dateText) {
        SimpleDateFormat inputDateFormat = new SimpleDateFormat("MMMM d, yyyy", Locale.ENGLISH);
        SimpleDateFormat outputDateFormat = new SimpleDateFormat("yyyy-MM-dd");

        try {
            Date parsedDate = inputDateFormat.parse(dateText);
            return outputDateFormat.format(parsedDate);
        } catch (ParseException e) {
            logger.warn("날짜 형식 변환 실패: {}", e.getMessage());
            return null;
        }
    }
}
