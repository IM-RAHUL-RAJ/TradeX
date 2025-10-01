const axios = require('axios');
const BACKEND_URL = 'http://spring-app:8081/wallet';

exports.getWalletBalance = async (clientId) => {
  const response = await axios.get(`${BACKEND_URL}/${clientId}`);
  return response.data;
};

exports.deposit = async (walletRequest) => {
  const response = await axios.post(`${BACKEND_URL}/${walletRequest.clientId}/deposit`, walletRequest);
  return response.data;
};

exports.withdraw = async (walletRequest) => {
  const response = await axios.post(`${BACKEND_URL}/${walletRequest.clientId}/withdraw`, walletRequest);
  return response.data;
};
