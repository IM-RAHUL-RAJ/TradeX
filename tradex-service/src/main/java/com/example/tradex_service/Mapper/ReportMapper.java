package com.example.tradex_service.Mapper;

import com.example.tradex_service.DTO.Response.PortfolioPositionResponseDto;
import com.example.tradex_service.DTO.Response.TradeResponseDto;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ReportMapper {

    @Select("""
        SELECT 
            pp.INSTRUMENTID as instrumentId,
            pp.DESCRIPTION as description, 
            pp.QUANTITY as quantity,
            pp.COST as cost,
            pp.CLIENTID as clientId
        FROM PORTFOLIO_POSITION pp
        WHERE pp.CLIENTID = #{clientId}
        ORDER BY pp.COST DESC
    """)
    @Results({
            @Result(property = "instrumentId", column = "instrumentId"),
            @Result(property = "description", column = "description"),
            @Result(property = "quantity", column = "quantity"),
            @Result(property = "cost", column = "cost"),
            @Result(property = "clientId", column = "clientId")
    })
    List<PortfolioPositionResponseDto> getPortfolioPositionsForReport(@Param("clientId") String clientId);

    @Select("SELECT CASHBALANCE FROM CLIENT WHERE CLIENTID = #{clientId}")
    Double getCashBalanceByClientId(@Param("clientId") String clientId);

    @Select("""
        SELECT 
            t.TRADEID as tradeId,
            t.INSTRUMENTID as instrumentId,
            t.CLIENTID as clientId,
            t.QUANTITY as quantity,
            t.EXECUTIONPRICE as executionPrice,
            t.DIRECTION as direction,
            t.CASHVALUE as cashValue
        FROM TRADE t
        WHERE t.CLIENTID = #{clientId}
        ORDER BY t.EXECUTIONPRICE DESC
        FETCH FIRST 50 ROWS ONLY
    """)
    @Results({
            @Result(property = "tradeId", column = "tradeId"),
            @Result(property = "instrumentId", column = "instrumentId"),
            @Result(property = "clientId", column = "clientId"),
            @Result(property = "quantity", column = "quantity"),
            @Result(property = "executionPrice", column = "executionPrice"),
            @Result(property = "direction", column = "direction"),
            @Result(property = "cashValue", column = "cashValue")
    })
    List<TradeResponseDto> getTradeHistoryForReport(@Param("clientId") String clientId);

    @Select("SELECT COUNT(*) FROM TRADE WHERE CLIENTID = #{clientId}")
    Integer getTotalTradeCount(@Param("clientId") String clientId);

    @Select("SELECT COALESCE(SUM(ABS(CASHVALUE)), 0) FROM TRADE WHERE CLIENTID = #{clientId}")
    Double getTotalTradeVolume(@Param("clientId") String clientId);
}