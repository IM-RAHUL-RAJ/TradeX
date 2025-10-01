package com.example.tradex_service.Mapper;

import com.example.tradex_service.Models.Trade;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TradeMapper {

	@Insert("INSERT INTO trade (tradeid, clientid, instrumentid, orderid, quantity, executionprice, direction, cashvalue) " +
	        "VALUES (#{tradeId}, #{clientId}, #{instrumentId}, #{order.orderId}, #{quantity}, #{executionPrice}, #{direction}, #{cashValue})")
	int insert(Trade trade);


    @Select("SELECT * FROM trade WHERE tradeid = #{tradeId}")
    Trade findById(Long tradeId);

    @Select("SELECT * FROM trade WHERE clientid = #{clientId}")
    List<Trade> findByClient(Long clientId);

    @Update("UPDATE trade SET status = #{status} WHERE tradeid = #{tradeId}")
    int updateStatus(@Param("tradeId") Long tradeId, @Param("status") String status);
}
