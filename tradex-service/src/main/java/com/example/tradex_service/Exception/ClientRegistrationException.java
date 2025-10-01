package com.example.tradex_service.Exception;

public class ClientRegistrationException extends RuntimeException {
    public ClientRegistrationException(String message) {
        super(message);
    }
    public ClientRegistrationException(String message, Throwable cause) {
        super(message, cause);
    }
}

