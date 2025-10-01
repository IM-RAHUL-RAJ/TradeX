package com.example.tradex_service.Models;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * Represents a tradable instrument.
 */
@Data
public class Instrument {
	private String instrumentId;
	
	@JsonProperty("instrumentDescription")
    private String description;
	
    private String externalIdType;
    private String externalId;
    private String categoryId;
    private int minQuantity;
    private int maxQuantity;
}
