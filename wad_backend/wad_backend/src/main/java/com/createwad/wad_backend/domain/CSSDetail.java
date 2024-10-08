package com.createwad.wad_backend.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CSSDetail {
    private String position;
    private String backgroundColor;
    private String color;
    private String padding;
    private String textAlign;
}