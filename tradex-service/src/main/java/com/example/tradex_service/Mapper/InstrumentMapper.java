package com.example.tradex_service.Mapper;

import com.example.tradex_service.Models.Instrument;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface InstrumentMapper {

    @Insert("INSERT INTO instruments (instrumentid, description, externalidtype, externalid, categoryid, minquantity, maxquantity) " +
            "VALUES (#{instrumentId}, #{description}, #{externalIdType}, #{externalId}, #{categoryId}, #{minQuantity}, #{maxQuantity})")
    int insert(Instrument instrument);

    @Select("SELECT * FROM instruments WHERE instrumentid = #{instrumentId}")
    Instrument findById(String instrumentId);

    @Select("SELECT * FROM instruments")
    List<Instrument> findAll();
}
