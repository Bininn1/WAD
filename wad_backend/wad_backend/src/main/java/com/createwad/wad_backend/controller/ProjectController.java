package com.createwad.wad_backend.controller;

import com.createwad.wad_backend.model.Project;
import com.createwad.wad_backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:3000")  // React 앱이 실행 중인 주소로 설정
public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.findAll();
    }


    @PostMapping
    public Project createProject(@RequestBody Project project) {
        System.out.println(project); //로그출력
        return projectService.save(project);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        System.out.println("Deleting the record of ID: " + id); // 로그 출력 (선택 사항)
        projectService.deleteById(id);
    }

}