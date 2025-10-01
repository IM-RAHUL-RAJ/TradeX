package com.example.tradex_service.Service.ServiceImpl;

import com.example.tradex_service.Models.Preferences;
import com.example.tradex_service.Service.GeminiService;
import com.example.tradex_service.DTO.Response.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class GeminiServiceImpl implements GeminiService {

    @Value("${google.gemini.api.key}")
    private String apiKey;

    @Value("${google.gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiServiceImpl() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public RoboAdvisorResponseDTO getStockRecommendations(Preferences preferences, String clientId) {
        try {
            String prompt = buildStockRecommendationPrompt(preferences);
            String geminiResponse = callGeminiAPI(prompt);
            return parseStockRecommendationResponse(geminiResponse, clientId);
        } catch (Exception e) {
            return createErrorResponse("Error generating stock recommendations: " + e.getMessage(), clientId);
        }
    }

    @Override
    public RoboAdvisorResponseDTO getPortfolioAnalysis(Preferences preferences, String clientId) {
        try {
            String prompt = buildPortfolioAnalysisPrompt(preferences);
            String geminiResponse = callGeminiAPI(prompt);
            return parsePortfolioAnalysisResponse(geminiResponse, clientId);
        } catch (Exception e) {
            return createErrorResponse("Error generating portfolio analysis: " + e.getMessage(), clientId);
        }
    }

    @Override
    public RoboAdvisorResponseDTO getMarketInsights(Preferences preferences, String clientId) {
        try {
            String prompt = buildMarketInsightsPrompt(preferences);
            String geminiResponse = callGeminiAPI(prompt);
            return parseMarketInsightsResponse(geminiResponse, clientId);
        } catch (Exception e) {
            return createErrorResponse("Error generating market insights: " + e.getMessage(), clientId);
        }
    }

    private String callGeminiAPI(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> parts = new HashMap<>();
            parts.put("text", prompt);

            content.put("parts", Arrays.asList(parts));
            requestBody.put("contents", Arrays.asList(content));

            String url = apiUrl + "?key=" + apiKey;
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            Map<String, Object> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class).getBody();

            // Extract text from Gemini response
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> candidate = candidates.get(0);
                Map<String, Object> content_response = (Map<String, Object>) candidate.get("content");
                List<Map<String, Object>> parts_response = (List<Map<String, Object>>) content_response.get("parts");
                if (parts_response != null && !parts_response.isEmpty()) {
                    return (String) parts_response.get(0).get("text");
                }
            }

            return "No response from AI";
        } catch (Exception e) {
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage(), e);
        }
    }

    private String buildStockRecommendationPrompt(Preferences preferences) {
        return String.format("""
            You are a professional financial advisor. Based on the following investment preferences, 
            provide 3-5 specific stock recommendations with reasoning.
            
            Client Profile:
            - Investment Purpose: %s
            - Risk Tolerance: %s
            - Income Level: %s
            - Investment Duration: %s
            - Robo Advisor Enabled: %s
            
            Please provide your response in this exact JSON format:
            {
                "recommendations": [
                    {
                        "symbol": "STOCK_SYMBOL",
                        "companyName": "Company Name",
                        "recommendation": "BUY/HOLD/SELL",
                        "targetPrice": 150.00,
                        "reasoning": "Brief reasoning",
                        "riskLevel": "LOW/MEDIUM/HIGH",
                        "allocationPercentage": 20.0
                    }
                ],
                "overallStrategy": "Brief overall investment strategy"
            }
            
            Focus on well-known stocks like AAPL, GOOGL, MSFT, TSLA, AMZN, etc.
            Ensure allocations add up to 100%%.
            """,
                preferences.getPurpose(),
                preferences.getRisk(),
                preferences.getIncome(),
                preferences.getLength(),
                preferences.isRoboAdvisor()
        );
    }

    private String buildPortfolioAnalysisPrompt(Preferences preferences) {
        return String.format("""
            You are a professional portfolio analyst. Analyze the investment profile and provide portfolio analysis.
            
            Client Profile:
            - Investment Purpose: %s
            - Risk Tolerance: %s
            - Income Level: %s
            - Investment Duration: %s
            
            Provide response in this JSON format:
            {
                "overallRisk": "LOW/MEDIUM/HIGH",
                "riskScore": 7.5,
                "diversificationLevel": "POOR/ADEQUATE/GOOD/EXCELLENT",
                "riskFactors": ["factor1", "factor2", "factor3"],
                "recommendations": "Detailed recommendations for portfolio improvement"
            }
            """,
                preferences.getPurpose(),
                preferences.getRisk(),
                preferences.getIncome(),
                preferences.getLength()
        );
    }

    private String buildMarketInsightsPrompt(Preferences preferences) {
        return String.format("""
            You are a market analyst. Provide current market insights relevant to this investment profile.
            
            Client Profile:
            - Investment Purpose: %s
            - Risk Tolerance: %s
            - Investment Duration: %s
            
            Provide response in this JSON format:
            {
                "marketTrend": "BULLISH/BEARISH/NEUTRAL",
                "sectorRecommendations": "Top sectors to consider",
                "economicOutlook": "Brief economic outlook",
                "keyInsights": ["insight1", "insight2", "insight3"]
            }
            """,
                preferences.getPurpose(),
                preferences.getRisk(),
                preferences.getLength()
        );
    }

    private RoboAdvisorResponseDTO parseStockRecommendationResponse(String response, String clientId) {
        try {
            // Try to extract JSON from the response
            String jsonString = extractJSON(response);
            JsonNode jsonNode = objectMapper.readTree(jsonString);

            RoboAdvisorResponseDTO dto = new RoboAdvisorResponseDTO();
            dto.setClientId(clientId);
            dto.setSuccess(true);
            dto.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            // Parse recommendations
            List<StockRecommendationDTO> recommendations = new ArrayList<>();
            JsonNode recsNode = jsonNode.get("recommendations");
            if (recsNode != null && recsNode.isArray()) {
                for (JsonNode rec : recsNode) {
                    StockRecommendationDTO stock = new StockRecommendationDTO();
                    stock.setSymbol(rec.get("symbol").asText());
                    stock.setCompanyName(rec.get("companyName").asText());
                    stock.setRecommendation(rec.get("recommendation").asText());
                    stock.setTargetPrice(rec.get("targetPrice").asDouble());
                    stock.setReasoning(rec.get("reasoning").asText());
                    stock.setRiskLevel(rec.get("riskLevel").asText());
                    stock.setAllocationPercentage(rec.get("allocationPercentage").asDouble());
                    recommendations.add(stock);
                }
            }

            dto.setStockRecommendations(recommendations);
            dto.setOverallStrategy(jsonNode.get("overallStrategy").asText());
            dto.setMessage("Stock recommendations generated successfully");

            return dto;
        } catch (Exception e) {
            return createErrorResponse("Error parsing stock recommendations: " + e.getMessage(), clientId);
        }
    }

    private RoboAdvisorResponseDTO parsePortfolioAnalysisResponse(String response, String clientId) {
        try {
            String jsonString = extractJSON(response);
            JsonNode jsonNode = objectMapper.readTree(jsonString);

            RoboAdvisorResponseDTO dto = new RoboAdvisorResponseDTO();
            dto.setClientId(clientId);
            dto.setSuccess(true);
            dto.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            PortfolioAnalysisDTO analysis = new PortfolioAnalysisDTO();
            analysis.setOverallRisk(jsonNode.get("overallRisk").asText());
            analysis.setRiskScore(jsonNode.get("riskScore").asDouble());
            analysis.setDiversificationLevel(jsonNode.get("diversificationLevel").asText());

            List<String> riskFactors = new ArrayList<>();
            JsonNode factorsNode = jsonNode.get("riskFactors");
            if (factorsNode != null && factorsNode.isArray()) {
                for (JsonNode factor : factorsNode) {
                    riskFactors.add(factor.asText());
                }
            }
            analysis.setRiskFactors(riskFactors);
            analysis.setRecommendations(jsonNode.get("recommendations").asText());

            dto.setPortfolioAnalysis(analysis);
            dto.setMessage("Portfolio analysis generated successfully");

            return dto;
        } catch (Exception e) {
            return createErrorResponse("Error parsing portfolio analysis: " + e.getMessage(), clientId);
        }
    }

    private RoboAdvisorResponseDTO parseMarketInsightsResponse(String response, String clientId) {
        try {
            String jsonString = extractJSON(response);
            JsonNode jsonNode = objectMapper.readTree(jsonString);

            RoboAdvisorResponseDTO dto = new RoboAdvisorResponseDTO();
            dto.setClientId(clientId);
            dto.setSuccess(true);
            dto.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            MarketInsightsDTO insights = new MarketInsightsDTO();
            insights.setMarketTrend(jsonNode.get("marketTrend").asText());
            insights.setSectorRecommendations(jsonNode.get("sectorRecommendations").asText());
            insights.setEconomicOutlook(jsonNode.get("economicOutlook").asText());

            List<String> keyInsights = new ArrayList<>();
            JsonNode insightsNode = jsonNode.get("keyInsights");
            if (insightsNode != null && insightsNode.isArray()) {
                for (JsonNode insight : insightsNode) {
                    keyInsights.add(insight.asText());
                }
            }
            insights.setKeyInsights(keyInsights);

            dto.setMarketInsights(insights);
            dto.setMessage("Market insights generated successfully");

            return dto;
        } catch (Exception e) {
            return createErrorResponse("Error parsing market insights: " + e.getMessage(), clientId);
        }
    }

    private String extractJSON(String response) {
        // Remove markdown formatting if present
        response = response.replaceAll("``````", "").trim();

        // Find JSON start and end
        int start = response.indexOf("{");
        int end = response.lastIndexOf("}") + 1;

        if (start >= 0 && end > start) {
            return response.substring(start, end);
        }

        throw new RuntimeException("No valid JSON found in response");
    }

    private RoboAdvisorResponseDTO createErrorResponse(String errorMessage, String clientId) {
        RoboAdvisorResponseDTO dto = new RoboAdvisorResponseDTO();
        dto.setClientId(clientId);
        dto.setSuccess(false);
        dto.setMessage(errorMessage);
        dto.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return dto;
    }
}
