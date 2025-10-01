// service/PortfolioService.js
const axios = require('axios');

const BACKEND_URL = 'http://spring-app:8081/portfolio';

exports.getPortfolio = async (clientId) => {
    console.log('Service: Getting portfolio for clientId:', clientId);

    const response = await axios.get(`${BACKEND_URL}/${clientId}`);
    console.log('Service: getPortfolio response:', response.data);

    return response.data;
};
