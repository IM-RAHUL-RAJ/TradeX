package com.example.tradex_service.Mapper;

import com.example.tradex_service.DTO.Response.TradeResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TradeHistoryMapper {

    @Select("""
        SELECT tradeId, instrumentId, clientId, quantity, executionPrice, direction
        FROM trade
        WHERE clientId = #{clientId}
        ORDER BY executionPrice DESC
        FETCH FIRST 100 ROWS ONLY
    """)
    @Results({
            @Result(property = "tradeId", column = "tradeId"),
            @Result(property = "instrumentId", column = "instrumentId"),
            @Result(property = "clientId", column = "clientId"),
            @Result(property = "quantity", column = "quantity"),
            @Result(property = "executionPrice", column = "executionPrice"),
            @Result(property = "direction", column = "direction"),
    })
    List<TradeResponseDto> findTradesByClientId(@Param("clientId") String clientId);
}

