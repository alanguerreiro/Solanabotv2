// decision.js

const { swapToken } = require('./swap');
const { getPrice } = require('./price');
const trackedTokens = {}; // Guarda tokens comprados e seu preço de entrada

const BUY_AMOUNT = 5; // USD

async function handleToken(token) {
  const mint = token.mintAddress;

  if (trackedTokens[mint]) return; // Já comprou

  console.log(`🛒 Novo token encontrado: ${mint}`);
  console.log('🔄 Realizando compra...');

  await swapToken(mint, BUY_AMOUNT);

  const entryPrice = await getPrice(mint);
  if (!entryPrice) return console.log('⚠️ Não foi possível obter o preço de entrada.');

  trackedTokens[mint] = {
    entryPrice,
    timestamp: Date.now()
  };

  console.log(`💾 Token ${mint} comprado a $${entryPrice}`);
}

async function monitorProfits() {
  for (const mint of Object.keys(trackedTokens)) {
    const currentPrice = await getPrice(mint);
    const entry = trackedTokens[mint];

    if (!currentPrice || !entry) continue;

    const profitPercent = ((currentPrice - entry.entryPrice) / entry.entryPrice) * 100;

    if (profitPercent >= 200) {
      console.log(`🚀 Vendendo ${mint} com lucro de ${profitPercent.toFixed(2)}%`);
      await swapToken('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 5); // Simula venda p/ USDC
      delete trackedTokens[mint];
    } else if (profitPercent <= -20) {
      console.log(`📉 Stop Loss ativado para ${mint} com perda de ${profitPercent.toFixed(2)}%`);
      await swapToken('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 5); // Simula venda p/ USDC
      delete trackedTokens[mint];
    } else {
      console.log(`📊 ${mint}: ${profitPercent.toFixed(2)}%`);
    }
  }
}

module.exports = { handleToken, monitorProfits };
