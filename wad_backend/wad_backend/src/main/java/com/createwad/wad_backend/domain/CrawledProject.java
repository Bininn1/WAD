package com.createwad.wad_backend.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "crawled_projects")
public class CrawledProject {

    @Id
    private String id;

    private String repoUrl;
    private String code;
    private Date updateDate; // 업데이트 날짜 필드 추가
    private String updateDateText; // 웹 페이지에서 추출한 날짜 정보를 저장하는 필드 추가
    private String projectId;

    // getters and setters

    public void setRepoUrl(String repoUrl) {
        this.repoUrl = repoUrl;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }
    public void setUpdateDateText(String updateDateText) {
        this.updateDateText = updateDateText;
    }
    public String getRepoUrl() {
        return repoUrl;
    }

    public String getCode() {
        return code;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public String getProjectId() {
        return projectId;
    }
    public String getUpdateDateText() {
        return updateDateText;
    }

}
