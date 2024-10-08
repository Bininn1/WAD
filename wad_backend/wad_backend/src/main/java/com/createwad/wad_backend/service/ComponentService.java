package com.createwad.wad_backend.service;

import com.createwad.wad_backend.domain.ComponentInfo;
import com.createwad.wad_backend.repository.ComponentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service    // 서비스 빈으로 등록
public class ComponentService {
    @Autowired  // 레포지토리 의존성 주입
    private ComponentRepository componentRepository;

    // 컴포넌트 정보 저장 메서드
    public ComponentInfo saveComponent(ComponentInfo componentInfo) {
        componentInfo.setCompTime(LocalDateTime.now()); // 현재 시간 설정
        return componentRepository.save(componentInfo);
    }

    public List<ComponentInfo> getAllComponents() {
        return componentRepository.findAll();
    }
}