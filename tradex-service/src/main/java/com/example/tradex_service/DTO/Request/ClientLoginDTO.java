package com.example.tradex_service.DTO.Request;



import lombok.Data;

@Data
public class ClientLoginDTO {
    private String email;
    private String password;
}
