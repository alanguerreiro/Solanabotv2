import { analisarToken } from './decision.js';

const BIRDEYE_API_KEY = 'f6238bead5294bc98607d0e4be6082d8'; // ✅ SUA CHAVE
const INTERVALO_MS = 15000; // 15 segundos

async function buscarTokensRecentes() {
  try {
    const res = await fetch('https://public-api.birdeye.so/public/token/solana/new-token', {
      headers: {
        'X-API-KEY': BIRDEYE_API_KEY
      }
    });

    const data = await res.json();

    if (!data || !data.data || !Array.isArray(data.data)) {
      console.log('Nenhum token encontrado.');
      return;
    }

    console.log(`🔎 Tokens encontrados: ${data.data.length}`);
    for (const token of data.data) {
      const tokenInfo = {
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        volume: token.volume_24h_usd || 0,
        createdAt: token.created_at || Date.now()
      };

      await analisarToken(tokenInfo);
    }
  } catch (error) {
    console.error('❌ Erro ao buscar tokens:', error);
  }
}

// Inicia o scanner em loop
setInterval(buscarTokensRecentes, INTERVALO_MS);
console.log("🛰️ Scanner iniciado...");
