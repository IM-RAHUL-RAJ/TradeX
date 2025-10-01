package com.example.tradex_service.Mapper;

import com.example.tradex_service.Models.Preferences;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface PreferencesMapper {

    @Insert("""
        INSERT INTO preferences (
            CLIENTID,
            INVESTMENTPURPOSE,
            RISKTOLERANCE,
            INCOMECATEGORY,
            LENGTHOFINVESTMENT,
            ROBOADVISOR
        )
        VALUES (
            #{clientId},
            #{purpose},
            #{risk},
            #{income},
            #{length},
            #{roboAdvisor}  -- boolean maps to NUMBER(1)
        )
    """)
    void insertPreferences(Preferences preferences);

    @Select("""
        SELECT CLIENTID,
               INVESTMENTPURPOSE as purpose,
               RISKTOLERANCE as risk,
               INCOMECATEGORY as income,
               LENGTHOFINVESTMENT as length,
               ROBOADVISOR as roboAdvisor  -- NUMBER(1) maps to boolean
        FROM preferences
        WHERE CLIENTID = #{clientId}
    """)
    Preferences selectPreferencesByClientId(String clientId);

    @Update("""
        UPDATE preferences
        SET
            INVESTMENTPURPOSE = #{purpose},
            RISKTOLERANCE = #{risk},
            INCOMECATEGORY = #{income},
            LENGTHOFINVESTMENT = #{length},
            ROBOADVISOR = #{roboAdvisor}  -- boolean maps to NUMBER(1)
        WHERE CLIENTID = #{clientId}
    """)
    void updatePreferences(Preferences preferences);
}
