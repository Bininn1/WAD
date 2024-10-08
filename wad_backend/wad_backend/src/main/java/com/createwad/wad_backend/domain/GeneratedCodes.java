package com.createwad.wad_backend.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "generated_codes")
public class GeneratedCodes {
    @Id
    private String id;
    private String code;  // URL 대신 코드를 저장하기 위한 필드
}
