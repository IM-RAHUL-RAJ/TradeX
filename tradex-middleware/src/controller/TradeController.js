const express = require('express');
const router = express.Router();
const tradeService = require('../service/TradeService');

console.log('TradeController loaded');

// Execute trade
router.post('/execute', async (req, res) => {
  try {
    console.log('Execute trade payload:', req.body);
    const authorizationHeader = req.headers['authorization'];
    const response = await tradeService.executeTrade(req.body, authorizationHeader);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get trade history for client
router.get('/:clientId', async (req, res) => {
  try {
    const response = await tradeService.getTradeHistory(req.params.clientId);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
