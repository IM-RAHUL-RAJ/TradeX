// service/RoboAdvisorService.js
const axios = require('axios');

const BACKEND_URL = 'http://spring-app:8081/robo-advisor';

// ----------------- Get stock recommendations -----------------
exports.getRecommendations = async (clientId) => {
    console.log('Service: Getting recommendations for clientId:', clientId);
    const response = await axios.get(`${BACKEND_URL}/recommendations/${clientId}`);
    console.log('Service: Recommendations response:', response.data);
    return response.data;
};

// ----------------- Get portfolio analysis -----------------
exports.getPortfolioAnalysis = async (clientId) => {
    console.log('Service: Getting portfolio analysis for clientId:', clientId);
    const response = await axios.get(`${BACKEND_URL}/portfolio-analysis/${clientId}`);
    console.log('Service: Portfolio analysis response:', response.data);
    return response.data;
};

// ----------------- Get market insights -----------------
exports.getMarketInsights = async (clientId) => {
    console.log('Service: Getting market insights for clientId:', clientId);
    const response = await axios.get(`${BACKEND_URL}/market-insights/${clientId}`);
    console.log('Service: Market insights response:', response.data);
    return response.data;
};
