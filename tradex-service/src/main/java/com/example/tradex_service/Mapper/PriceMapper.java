package com.example.tradex_service.Mapper;

import com.example.tradex_service.Models.Price;
import org.apache.ibatis.annotations.*;

@Mapper
public interface PriceMapper {

    @Insert("INSERT INTO price (instrumentid, bidprice, askprice) " +
            "VALUES (#{instrumentId}, #{bidPrice}, #{askPrice})")
    int insert(Price price);

    @Select("SELECT * FROM price WHERE instrumentid = #{instrumentId}")
    Price findByInstrument(String instrumentId);

    @Update("UPDATE price SET bidprice = #{bidPrice}, askprice = #{askPrice} WHERE instrumentid = #{instrumentId}")
    int update(Price price);
}
