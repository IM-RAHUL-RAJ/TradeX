// controllers/ReportController.js
const express = require('express');
const router = express.Router();
const reportService = require('../service/ReportService');

console.log('ReportController loaded');

// ----------------- Get portfolio report -----------------
router.get('/portfolio/:clientId', async (req, res) => {
    console.log('GET /portfolio/:clientId', req.params.clientId);
    try {
        const report = await reportService.getPortfolioReport(req.params.clientId);
        res.json(report);
    } catch (err) {
        console.error('Error in /portfolio/:clientId:', err);
        res.status(500).json({ error: err.message });
    }
});

// ----------------- Get trade history report -----------------
router.get('/trade-history/:clientId', async (req, res) => {
    console.log('GET /trade-history/:clientId', req.params.clientId);
    try {
        const report = await reportService.getTradeHistoryReport(req.params.clientId);
        res.json(report);
    } catch (err) {
        console.error('Error in /trade-history/:clientId:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;