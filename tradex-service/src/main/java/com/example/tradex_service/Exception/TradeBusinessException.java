package com.example.tradex_service.Exception;

public class TradeBusinessException extends RuntimeException {
    public TradeBusinessException(String message) {
        super(message);
    }
    public TradeBusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}

