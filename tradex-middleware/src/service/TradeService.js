const axios = require('axios');
const BACKEND_URL = 'http://spring-app:8081/trades';

exports.executeTrade = async (tradeRequest, authorizationHeader) => {
  const config = {};
  if (authorizationHeader) {
    config.headers = { Authorization: authorizationHeader };
  }
  const response = await axios.post(`${BACKEND_URL}/execute`, tradeRequest, config);
  return response.data;
};

exports.getTradeHistory = async (clientId) => {
  const response = await axios.get(`${BACKEND_URL}/${clientId}`);
  return response.data;
};
