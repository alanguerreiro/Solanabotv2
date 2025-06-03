// decision.js
async function decideAction(token) {
  const profitTarget = 2.0; // 100%
  const stopLoss = 0.85;    // -15%
  const entryPrice = token.entryPrice || 1; // valor fictício

  const ageMinutes = (Date.now() - new Date(token.launchDate).getTime()) / 60000;
  const currentPrice = token.currentPrice || entryPrice;

  if (currentPrice >= entryPrice * profitTarget) {
    console.log(`Token ${token.symbol} atingiu alvo de lucro`);
    return "SELL";
  }

  if (currentPrice <= entryPrice * stopLoss) {
    console.log(`Token ${token.symbol} atingiu stop loss`);
    return "SELL";
  }

  if (ageMinutes < 300 && token.potentialMultiplier >= 5) {
    console.log(`Token ${token.symbol} mantido por potencial`);
    return "HOLD";
  }

  return "HOLD";
}
