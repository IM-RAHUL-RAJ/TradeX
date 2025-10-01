console.log('ClientController loaded');


// controllers/ClientController.js
const express = require('express');
const router = express.Router();
const clientService = require('../service/ClientService');

// Check if email exists
router.get('/check-email', async (req, res) => {
  console.log('Inside /check-email route');
  console.log('Query params:', req.query);
  console.log('Email param:', req.query.email);

  if (!req.query.email) {
    return res.status(400).json({ error: 'Email query parameter is required' });
  }

  try {
    const exists = await clientService.checkEmail(req.query.email);
    console.log('Backend returned:', exists);
    res.json(exists);
  } catch (err) {
    console.error('Error in /check-email:', err);
    res.status(500).json({ error: err.message });
  }
});
 
// Register new client
router.post('/register', async (req, res) => {
  try {
    const response = await clientService.register(req.body);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
 
// Client login
router.post('/login', async (req, res) => {
  try {
    const response = await clientService.login(req.body);
    res.json(response);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});


module.exports = router;

// Get client by ID
router.get('/:clientId', async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    // Omit password in response
    delete client.password;
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
