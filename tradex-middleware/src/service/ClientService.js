const axios = require('axios');
const BACKEND_URL = 'http://spring-app:8081/client';
 
exports.login = async (client) => {
  const response = await axios.post(`${BACKEND_URL}/login`, client);
  return response.data;
};
 
exports.register = async (client) => {
  const response = await axios.post(`${BACKEND_URL}/register`, client);
  return response.data;
};
 
exports.getClientById = async (clientId) => {
  const response = await axios.get(`${BACKEND_URL}/${clientId}`);
  return response.data;
};
 
exports.checkEmail = async (email) => {
  console.log('Service: Sending request to backend with email:', email);
  const response = await axios.get(`${BACKEND_URL}/check-email`, { params: { email } });
  console.log('Service: Backend responded with:', response.data);
  return response.data;
};
 
