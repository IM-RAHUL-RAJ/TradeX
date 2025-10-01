package com.example.tradex_service.Models;


import static org.junit.jupiter.api.Assertions.*;

import com.example.tradex_service.Models.Preferences;
import org.junit.jupiter.api.Test;

public class PreferencesTest {

    @Test
    void canCreatePreferencesWithValues() {
        Preferences p = new Preferences();
        p.setClientId("client123");
        p.setPurpose("Retirement");
        p.setRisk("Average");
        p.setIncome("40001-60000");
        p.setLength("7-10 years");
        p.setRoboAdvisor(true);

        assertEquals("client123", p.getClientId());
        assertEquals("Retirement", p.getPurpose());
        assertEquals("Average", p.getRisk());
        assertEquals("40001-60000", p.getIncome());
        assertEquals("7-10 years", p.getLength());
        assertTrue(p.isRoboAdvisor());
    }

    @Test
    void canSetAndGetAllFields() {
        Preferences prefs = new Preferences();
        prefs.setClientId("abc");
        prefs.setPurpose("Business Investment");
        prefs.setRisk("High Risk");
        prefs.setIncome("150000+");
        prefs.setLength("10-15 years");
        prefs.setRoboAdvisor(false);

        assertEquals("abc", prefs.getClientId());
        assertEquals("Business Investment", prefs.getPurpose());
        assertEquals("High Risk", prefs.getRisk());
        assertEquals("150000+", prefs.getIncome());
        assertEquals("10-15 years", prefs.getLength());
        assertFalse(prefs.isRoboAdvisor());
    }
}
