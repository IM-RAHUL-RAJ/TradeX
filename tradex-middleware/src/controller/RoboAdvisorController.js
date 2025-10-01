// controllers/RoboAdvisorController.js
const express = require('express');
const router = express.Router();
const roboAdvisorService = require('../service/RoboAdvisorService');

console.log('RoboAdvisorController loaded');

// ----------------- Get stock recommendations -----------------
router.get('/recommendations/:clientId', async (req, res) => {
    console.log('GET /recommendations/:clientId', req.params.clientId);
    try {
        const response = await roboAdvisorService.getRecommendations(req.params.clientId);
        res.json(response);
    } catch (err) {
        console.error('Error in /recommendations/:clientId:', err);
        res.status(500).json({ error: err.message });
    }
});

// ----------------- Get portfolio analysis -----------------
router.get('/portfolio-analysis/:clientId', async (req, res) => {
    console.log('GET /portfolio-analysis/:clientId', req.params.clientId);
    try {
        const response = await roboAdvisorService.getPortfolioAnalysis(req.params.clientId);
        res.json(response);
    } catch (err) {
        console.error('Error in /portfolio-analysis/:clientId:', err);
        res.status(500).json({ error: err.message });
    }
});

// ----------------- Get market insights -----------------
router.get('/market-insights/:clientId', async (req, res) => {
    console.log('GET /market-insights/:clientId', req.params.clientId);
    try {
        const response = await roboAdvisorService.getMarketInsights(req.params.clientId);
        res.json(response);
    } catch (err) {
        console.error('Error in /market-insights/:clientId:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;