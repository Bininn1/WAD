package model;

import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Integer projectId;

    @JoinColumn
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "generated_id")
    private String generatedId;

    @Column(name = "project_name")
    private String projectName;

    @Column(name = "project_info")
    private String projectInfo;

    @Column(name = "project_icon")
    private String projectIcon;

    @Column(name = "project_time")
    @CreationTimestamp
    private Date projectTime;

    @Column(name = "project_last_update")
    @UpdateTimestamp
    private Date projectLastUpdate;

    public Project() {}

    public Project(Integer projectId, Integer userId, String generatedId, String projectName, String projectInfo, String projectIcon, Date projectTime, Date projectLastUpdate) {
        this.projectId = projectId;
        this.userId = userId;
        this.generatedId = generatedId;
        this.projectName = projectName;
        this.projectInfo = projectInfo;
        this.projectIcon = projectIcon;
        this.projectTime = projectTime;
        this.projectLastUpdate = projectLastUpdate;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getGeneratedId() {
        return generatedId;
    }

    public void setGeneratedId(String generatedId) {
        this.generatedId = generatedId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectInfo() {
        return projectInfo;
    }

    public void setProjectInfo(String projectInfo) {
        this.projectInfo = projectInfo;
    }

    public String getProjectIcon() {
        return projectIcon;
    }

    public void setProjectIcon(String projectIcon) {
        this.projectIcon = projectIcon;
    }

    public Date getProjectTime() {
        return projectTime;
    }

    public void setProjectTime(Date projectTime) {
        this.projectTime = projectTime;
    }

    public Date getProjectLastUpdate() {
        return projectLastUpdate;
    }

    public void setProjectLastUpdate(Date projectLastUpdate) {
        this.projectLastUpdate = projectLastUpdate;
    }
}
