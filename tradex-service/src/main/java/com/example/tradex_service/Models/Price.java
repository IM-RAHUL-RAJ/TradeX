package com.example.tradex_service.Models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Represents bid/ask prices for an instrument.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Price {
	private String instrumentId;
    private double bidPrice;
    private double askPrice;
    private String priceTimestamp;  // ISO 8601 basic format string e.g. "20250826T090000Z"
    private Instrument instrument;
}
