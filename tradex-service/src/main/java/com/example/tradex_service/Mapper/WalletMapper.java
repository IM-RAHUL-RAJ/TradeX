package com.example.tradex_service.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.math.BigDecimal;

@Mapper
public interface WalletMapper {

    @Select("SELECT cashbalance FROM client WHERE clientId = #{clientId}")
    BigDecimal findCashBalanceByClientId(@Param("clientId") String clientId);

    @Update("UPDATE client SET cashbalance = cashbalance + #{amount} WHERE clientId = #{clientId}")
    void incrementCashBalance(@Param("clientId") String clientId, @Param("amount") BigDecimal amount);

    @Update("UPDATE client SET cashbalance = cashbalance - #{amount} WHERE clientId = #{clientId} AND cashbalance >= #{amount}")
    int decrementCashBalance(@Param("clientId") String clientId, @Param("amount") BigDecimal amount);
}
