package com.createwad.wad_backend.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public  class ComponentDetail {
    private String componentName;
    private boolean isSelected;
    private double left;
    private double top;
    private double width;
    private double height;
    private CSSDetail css;
}