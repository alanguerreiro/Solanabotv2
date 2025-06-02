// index.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/api/tokens', async (req, res) => {
  try {
    const response = await fetch('https://pump.fun/api/launchpad?sort=recent');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar tokens:', error);
    res.status(500).json({ error: 'Erro ao buscar tokens' });
  }
});

module.exports = app;
