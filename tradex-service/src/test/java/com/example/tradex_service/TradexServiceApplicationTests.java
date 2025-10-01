package com.example.tradex_service;
 
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.client.RestTemplate;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mockStatic;
 
@SpringBootTest
class TradexServiceApplicationTest {
 
    @Autowired
    private RestTemplate restTemplate;
 
    @Test
    void contextLoads() {
        // Verifies that the Spring Boot application context loads successfully
    }
 
    @Test
    void restTemplateBeanExists() {
        assertThat(restTemplate).isNotNull();
    }
 
    @Test
    void main_shouldRunWithoutExceptions() {
        // Mock SpringApplication.run to avoid actually starting the context again
        try (var mocked = mockStatic(SpringApplication.class)) {
            mocked.when(() -> SpringApplication.run(TradexServiceApplication.class, new String[]{}))
                    .thenReturn(null);
 
            TradexServiceApplication.main(new String[]{});
        }
    }
}