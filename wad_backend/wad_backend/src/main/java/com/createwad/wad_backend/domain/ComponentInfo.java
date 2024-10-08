package com.createwad.wad_backend.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "component")     // 해당 클래스를 MongoDB의 "component" 컬렉션에 매핑
public class ComponentInfo {
    @Id
    private ObjectId id;
    private String projectId;
    private String framework;
    private List<ComponentDetail> compInfo;
    private LocalDateTime compTime;
}
