package com.example.tradex_service.DTO.Response;

import com.example.tradex_service.Models.Instrument;
import java.math.BigDecimal;

public class PriceResponse {
    private BigDecimal askPrice;
    private BigDecimal bidPrice;
    private String priceTimestamp;
    private Instrument instrument; // Make sure this is Instrument, not String

    public Instrument getInstrument() { return instrument; }
    public void setInstrument(Instrument instrument) { this.instrument = instrument; }

    public BigDecimal getAskPrice() { return askPrice; }
    public void setAskPrice(BigDecimal askPrice) { this.askPrice = askPrice; }

    public BigDecimal getBidPrice() { return bidPrice; }
    public void setBidPrice(BigDecimal bidPrice) { this.bidPrice = bidPrice; }

    public String getPriceTimestamp() { return priceTimestamp; }
    public void setPriceTimestamp(String priceTimestamp) { this.priceTimestamp = priceTimestamp; }
}
