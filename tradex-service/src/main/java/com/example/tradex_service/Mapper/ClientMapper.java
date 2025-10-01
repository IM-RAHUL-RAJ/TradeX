package com.example.tradex_service.Mapper;

import com.example.tradex_service.Models.Client;
import com.example.tradex_service.Models.ClientIdentification;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.type.JdbcType;

import java.util.Set;

@Mapper
public interface ClientMapper {

    // Fetch client by clientId
    @Select("SELECT clientId, email, PASSWORD AS password, dateOfBirth, country, postalCode " +
            "FROM client WHERE clientId = #{clientId}")
    @Results({
            @Result(column = "clientId", property = "clientId"),
            @Result(column = "email", property = "email"),
            @Result(column = "password", property = "password", jdbcType = JdbcType.VARCHAR),
            @Result(column = "dateOfBirth", property = "dateOfBirth"),
            @Result(column = "country", property = "country"),
            @Result(column = "postalCode", property = "postalCode"),
            @Result(property = "identifications", column = "clientId", javaType = Set.class,
                    many = @Many(select = "com.example.tradex_service.Mapper.ClientMapper.findIdentificationsByClientId"))
    })
    Client findByClientId(@Param("clientId") String clientId);

    @Select("SELECT type, value FROM clientidentification WHERE clientId = #{clientId}")
    Set<ClientIdentification> findIdentificationsByClientId(@Param("clientId") String clientId);




    // Fetch client by email
    @Select("SELECT * FROM client WHERE email = #{email}")
    Client findByEmail(@Param("email") String email);

    // Fetch client by email and password (login)
    @Select("SELECT * FROM client WHERE email = #{email} AND password = #{password}")
    Client findByEmailAndPassword(@Param("email") String email, @Param("password") String password);

    @Insert("INSERT INTO client (clientId, email, password, dateOfBirth, country, postalCode, cashbalance) " +
            "VALUES (#{clientId}, #{email}, #{password,jdbcType=VARCHAR}, #{dateOfBirth,jdbcType=VARCHAR}, " +
            "#{country,jdbcType=VARCHAR}, #{postalCode,jdbcType=VARCHAR}, #{cashBalance})")
    void addClient(Client client);


    // Update password
    @Update("UPDATE client SET password = #{password} WHERE clientId = #{clientId}")
    void updatePassword(@Param("clientId") String clientId, @Param("password") String password);

    // Update email
    @Update("UPDATE client SET email = #{email} WHERE clientId = #{clientId}")
    void updateEmail(@Param("clientId") String clientId, @Param("email") String email);

    // Check if a specific identification exists
    @Select("SELECT COUNT(*) FROM clientidentification WHERE type = #{type} AND value = #{value}")
    int countIdentification(@Param("type") String type, @Param("value") String value);

    // Insert a client identification
    @Insert("INSERT INTO clientidentification (clientid, type, value) VALUES (#{clientId}, #{type}, #{value})")
    void addIdentification(@Param("clientId") String clientId,
                           @Param("type") String type,
                           @Param("value") String value);

    // Fetch cash balance for a client
    @Select("SELECT cashbalance FROM client WHERE clientid = #{clientId}")
    Double getCashBalance(@Param("clientId") String clientId);

    // Update cash balance
    @Update("UPDATE client SET cashbalance = #{cashBalance} WHERE clientId = #{clientId}")
    int updateCashBalance(@Param("clientId") String clientId, @Param("cashBalance") double cashBalance);
}
