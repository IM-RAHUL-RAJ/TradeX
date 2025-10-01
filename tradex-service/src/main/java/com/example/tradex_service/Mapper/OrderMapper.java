package com.example.tradex_service.Mapper;

import com.example.tradex_service.Models.Order;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface OrderMapper {

    @Insert("INSERT INTO orders (orderid, instrumentid, clientid, quantity, targetprice, direction) " +
            "VALUES (#{orderId}, #{instrumentId}, #{clientId}, #{quantity}, #{targetPrice}, #{direction})")
    int insert(Order order);

    @Select("SELECT orderid, instrumentid, clientid, quantity, targetprice, direction FROM orders WHERE orderid = #{orderId}")
    @Results({
        @Result(column="instrumentid", property="instrumentId")
    })
    Order findById(String orderId);

    @Select("SELECT orderid, instrumentid, clientid, quantity, targetprice, direction FROM orders WHERE clientid = #{clientId}")
    @Results({
        @Result(column="instrumentid", property="instrumentId")
    })
    List<Order> findByClient(String clientId);

    @Update("UPDATE orders SET direction = #{direction}, quantity = #{quantity}, targetprice = #{targetPrice} " +
            "WHERE orderid = #{orderId}")
    int update(Order order);
}
