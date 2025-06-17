// scanner.js

const fetch = require('node-fetch');
const { handleToken } = require('./decision');

const BIRDEYE_API_KEY = 'f6238bead5294bc98607d0e4be6082d8'; // sua chave
const CHECK_INTERVAL = 15000; // 15 segundos
let seen = new Set();

async function fetchPumpTokens() {
  try {
    const res = await fetch('https://pump.fun/api/projects?sort=launch_date&limit=20');
    const data = await res.json();

    return data.projects
      .filter(p => p?.mint)
      .map(p => ({
        name: p.metadata?.name || 'Unnamed',
        mintAddress: p.mint
      }));
  } catch (err) {
    console.error('❌ Erro ao buscar tokens do Pump.fun:', err);
    return [];
  }
}

async function scan() {
  console.log('🔍 Iniciando scanner Pump.fun...');

  setInterval(async () => {
    console.log('🔁 Buscando novos tokens...');
    const tokens = await fetchPumpTokens();

    for (const token of tokens) {
      if (!seen.has(token.mintAddress)) {
        seen.add(token.mintAddress);
        console.log(`🆕 Novo token: ${token.name} (${token.mintAddress})`);
        await handleToken(token);
      }
    }
  }, CHECK_INTERVAL);
}

module.exports = { scan };
