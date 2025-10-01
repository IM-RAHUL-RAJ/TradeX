package com.example.tradex_service.Models;

public enum Direction {
    BUY('B'),  // Fidelity Buys
    SELL('S'); // Fidelity Sells
    
    private final char code;

    Direction(char code) {
        this.code = code;
    }

    public char getCode() {
        return code;
    }

    // Optional: method to get Direction from char code
    public static Direction fromCode(char code) {
        for (Direction d : Direction.values()) {
            if (d.code == code) return d;
        }
        throw new IllegalArgumentException("Unknown code: " + code);
    }
}
