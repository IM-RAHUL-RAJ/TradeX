// service/PreferencesService.js
const axios = require('axios');

const BACKEND_URL = 'http://spring-app:8081/preferences';

exports.savePreferences = async (clientId, preferencesData) => {
    console.log('Service: Saving preferences for clientId:', clientId);
    const response = await axios.post(`${BACKEND_URL}/save/${clientId}`, preferencesData);
    console.log('Service: savePreferences response:', response.data);
    return response.data;
};

exports.updatePreferences = async (clientId, preferencesData) => {
    console.log('Service: Updating preferences for clientId:', clientId);
    const response = await axios.put(`${BACKEND_URL}/update/${clientId}`, preferencesData);
    console.log('Service: updatePreferences response:', response.data);
    return response.data;
};

exports.getPreferences = async (clientId) => {
    console.log('Service: Getting preferences for clientId:', clientId);
    const response = await axios.get(`${BACKEND_URL}/${clientId}`);
    console.log('Service: getPreferences response:', response.data);
    return response.data;
};
