// decision.js
const BUY_AMOUNT_USDC = 5;
const PROFIT_TARGET_PERCENT = 100;
const STOP_LOSS_PERCENT = 15;
const MAX_HOLD_HOURS = 5;

export function shouldBuy(token) {
  // Exemplo: só comprar se marketCap for menor que 10k
  return token.marketCap < 10000;
}

export function shouldSell(entryPrice, currentPrice, entryTime) {
  const profitPercent = ((currentPrice - entryPrice) / entryPrice) * 100;
  const timeHeldHours = (Date.now() - entryTime) / (1000 * 60 * 60);

  if (profitPercent >= PROFIT_TARGET_PERCENT) {
    console.log("🟢 Alvo de lucro atingido: vendendo");
    return true;
  }

  if (profitPercent <= -STOP_LOSS_PERCENT) {
    console.log("🔴 Stop Loss atingido: vendendo");
    return true;
  }

  if (timeHeldHours >= MAX_HOLD_HOURS) {
    console.log("⏰ Tempo máximo de espera atingido: vendendo");
    return true;
  }

  return false;
}
