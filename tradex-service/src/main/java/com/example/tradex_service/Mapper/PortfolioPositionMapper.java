package com.example.tradex_service.Mapper;

import com.example.tradex_service.DTO.Request.PortfolioRequestDto;
import com.example.tradex_service.DTO.Response.PortfolioPositionResponseDto;
import com.example.tradex_service.DTO.Response.PortfolioResponseDto;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PortfolioPositionMapper {
	
	

    @Select("SELECT INSTRUMENTID as instrumentId, DESCRIPTION as description, QUANTITY as quantity, COST as cost, CLIENTID as clientId FROM PORTFOLIO_POSITION WHERE CLIENTID = #{clientId}")
    @Results(id = "PortfolioPositionResult", value = {
        @Result(property = "instrumentId", column = "instrumentId"),
        @Result(property = "description", column = "description"),
        @Result(property = "quantity", column = "quantity"),
        @Result(property = "cost", column = "cost"),
        @Result(property = "clientId", column = "clientId")
    })
    List<PortfolioPositionResponseDto> findPositionsByClientId(@Param("clientId") String clientId);

    @Select("SELECT COUNT(*) FROM PORTFOLIO_POSITION WHERE INSTRUMENTID = #{instrumentId} AND CLIENTID = #{clientId}")
    int countPosition(@Param("instrumentId") String instrumentId, @Param("clientId") String clientId);

    @Select("SELECT INSTRUMENTID as instrumentId, DESCRIPTION as description, QUANTITY as quantity, COST as cost, CLIENTID as clientId FROM PORTFOLIO_POSITION WHERE INSTRUMENTID = #{instrumentId} AND CLIENTID = #{clientId}")
    @ResultMap("PortfolioPositionResult")
    PortfolioPositionResponseDto findPosition(@Param("instrumentId") String instrumentId, @Param("clientId") String clientId);

    @Insert("INSERT INTO PORTFOLIO_POSITION (INSTRUMENTID, CLIENTID, DESCRIPTION, QUANTITY, COST) VALUES (#{instrumentId}, #{clientId}, #{description}, #{quantity}, #{cost})")
    int insertPosition(PortfolioPositionResponseDto position);

    @Update("UPDATE PORTFOLIO_POSITION SET QUANTITY = #{quantity}, COST = #{cost}, DESCRIPTION = #{description} WHERE INSTRUMENTID = #{instrumentId} AND CLIENTID = #{clientId}")
    int updatePosition(PortfolioPositionResponseDto position);

    @Delete("DELETE FROM PORTFOLIO_POSITION WHERE INSTRUMENTID = #{instrumentId} AND CLIENTID = #{clientId}")
    int deletePosition(@Param("instrumentId") String instrumentId, @Param("clientId") String clientId);
}
