// controllers/PreferencesController.js
const express = require('express');
const router = express.Router();
const preferencesService = require('../service/PreferencesService');

console.log('PreferencesController loaded');

// ----------------- Save preferences -----------------
router.post('/save/:clientId', async (req, res) => {
    console.log('POST /save/:clientId', req.params.clientId, req.body);
    try {
        const response = await preferencesService.savePreferences(req.params.clientId, req.body);
        res.json(response);
    } catch (err) {
        console.error('Error in /save/:clientId:', err);
        res.status(500).json({ error: err.message });
    }
});

// ----------------- Update preferences -----------------
router.put('/update/:clientId', async (req, res) => {
    console.log('PUT /update/:clientId', req.params.clientId, req.body);
    try {
        const response = await preferencesService.updatePreferences(req.params.clientId, req.body);
        res.json(response);
    } catch (err) {
        console.error('Error in /update/:clientId:', err);
        res.status(500).json({ error: err.message });
    }
});

// ----------------- Get preferences -----------------
router.get('/:clientId', async (req, res) => {
    console.log('GET /:clientId', req.params.clientId);
    try {
        const prefs = await preferencesService.getPreferences(req.params.clientId);
        res.json(prefs);
    } catch (err) {
        console.error('Error in /:clientId:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
