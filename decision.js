const { swapToken } = require('./swap.js');
const { getPrice } = require('./price.js');

const BUY_AMOUNT = 5;
const PROFIT_TARGET_PERCENT = 200;
const STOP_LOSS_PERCENT = -20;

const trackedTokens = {};

async function handleToken(token) {
  const { mint } = token;
  console.log(`[🚀] Novo token encontrado: ${mint}`);
  console.log(`[💸] Realizando compra...`);

  await swapToken(mint, BUY_AMOUNT);

  const entryPrice = await getPrice(mint);
  if (!entryPrice) {
    console.log(`[⚠️] Não foi possível obter o preço de entrada para ${mint}`);
    return;
  }

  trackedTokens[mint] = {
    entryPrice,
    timestamp: Date.now(),
  };

  console.log(`[✅] Token ${mint} comprado a $${entryPrice}`);
}

async function monitorProfits() {
  for (const mint of Object.keys(trackedTokens)) {
    const entry = trackedTokens[mint];
    const currentPrice = await getPrice(mint);
    const profitPercent = ((currentPrice - entry.entryPrice) / entry.entryPrice) * 100;

    if (profitPercent >= PROFIT_TARGET_PERCENT) {
      console.log(`[🟢] Vendendo ${mint} com lucro de ${profitPercent.toFixed(2)}%`);
      await swapToken(mint, 5); // simula venda
      delete trackedTokens[mint];
    } else if (profitPercent <= STOP_LOSS_PERCENT) {
      console.log(`[🔴] Stop Loss ativado para ${mint} com perda de ${profitPercent.toFixed(2)}%`);
      await swapToken(mint, 5); // simula venda
      delete trackedTokens[mint];
    } else {
      console.log(`[ℹ️] ${mint} | Lucro atual: ${profitPercent.toFixed(2)}%`);
    }
  }
}

module.exports = {
  handleToken,
  monitorProfits
};
