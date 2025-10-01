package com.example.tradex_service.Models;


import static org.junit.jupiter.api.Assertions.*;

import com.example.tradex_service.Models.Direction;
import org.junit.jupiter.api.Test;

public class DirectionTest {

    @Test
    void getCodeReturnsCorrectChar() {
        assertEquals('B', Direction.BUY.getCode());
        assertEquals('S', Direction.SELL.getCode());
    }

    @Test
    void fromCodeReturnsCorrectEnum() {
        assertEquals(Direction.BUY, Direction.fromCode('B'));
        assertEquals(Direction.SELL, Direction.fromCode('S'));
    }

    @Test
    void fromCodeThrowsForInvalidCode() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            Direction.fromCode('X');
        });
        assertTrue(exception.getMessage().contains("Unknown code"));
    }
}
