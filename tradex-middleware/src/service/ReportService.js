// service/ReportService.js
const axios = require('axios');

const BACKEND_URL = 'http://spring-app:8081/reports';

// ----------------- Portfolio report -----------------
exports.getPortfolioReport = async (clientId) => {
    console.log('Service: Getting portfolio report for clientId:', clientId);
    const response = await axios.get(`${BACKEND_URL}/portfolio/${clientId}`);
    console.log('Service: Portfolio report response:', response.data);
    return response.data;
};

// ----------------- Trade history report -----------------
exports.getTradeHistoryReport = async (clientId) => {
    console.log('Service: Getting trade history report for clientId:', clientId);
    const response = await axios.get(`${BACKEND_URL}/trade-history/${clientId}`);
    console.log('Service: Trade history report response:', response.data);
    return response.data;
};
