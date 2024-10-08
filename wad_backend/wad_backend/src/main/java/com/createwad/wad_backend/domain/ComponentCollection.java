package com.createwad.wad_backend.domain;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "componentCollection")
public class ComponentCollection {
    @Id
    private String id;
    private String framework;
    private List<ComponentInfo> compInfo;

    public List<ComponentInfo> getCompInfo() {
        return compInfo;
    }

    public void setCompInfo(List<ComponentInfo> compInfo) {
        this.compInfo = compInfo;
    }

}

