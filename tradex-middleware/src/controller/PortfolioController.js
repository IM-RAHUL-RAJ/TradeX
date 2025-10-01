// controllers/PortfolioController.js
const express = require('express');
const router = express.Router();
const portfolioService = require('../service/PortfolioService');

console.log('PortfolioController loaded');

// ----------------- Get portfolio -----------------
router.get('/:clientId', async (req, res) => {
    console.log('GET /:clientId', req.params.clientId);

    try {
        const portfolio = await portfolioService.getPortfolio(req.params.clientId);
        res.json(portfolio);
    } catch (err) {
        console.error('Error in /:clientId:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;