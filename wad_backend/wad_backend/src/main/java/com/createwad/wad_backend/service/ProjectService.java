package com.createwad.wad_backend.service;
import com.createwad.wad_backend.model.Project;
import com.createwad.wad_backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // 프로젝트 생성
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    // 모든 프로젝트 조회
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // 프로젝트 ID로 프로젝트 조회
    public Optional<Project> getProjectById(Integer projectId) {
        return projectRepository.findById(projectId);
    }

    // 프로젝트 업데이트
    public Project updateProject(Project project) {
        return projectRepository.save(project);
    }

    // 프로젝트 삭제
    public void deleteById(Long projectId) {
        System.out.println("Deleting the record of ID: " + projectId);  // 로그 출력 (선택 사항)
        projectRepository.deleteById(Math.toIntExact(projectId));
    }

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Project save(Project project) {
        return projectRepository.save(project);
    }
}

