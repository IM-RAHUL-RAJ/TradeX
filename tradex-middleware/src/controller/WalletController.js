const express = require('express');
const router = express.Router();
const walletService = require('../service/WalletService');

console.log('WalletController loaded');

// Add funds to wallet
router.post('/:clientId/deposit', async (req, res) => {
  try {
    console.log('Deposit payload:', req.body);
    // Ensure clientId matches request body
    if (req.params.clientId !== req.body.clientId) {
      return res.status(400).json({ error: 'ClientId mismatch' });
    }
    const response = await walletService.deposit(req.body);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get wallet balance for client
router.get('/:clientId', async (req, res) => {
  try {
    const response = await walletService.getWalletBalance(req.params.clientId);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/:clientId/withdraw', async (req, res) => {
  try {
    if (req.params.clientId !== req.body.clientId) {
      return res.status(400).json({ error: 'ClientId mismatch' });
    }
    const response = await walletService.withdraw(req.body);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
