// Parâmetros de decisão
const BUY_AMOUNT_USDC = 5;
const PROFIT_TARGET_PERCENT = 100;
const STOP_LOSS_PERCENT = 15;
const HOLD_HOURS_IF_POTENTIAL = 5;

function deveComprar(token) {
  // Adicione lógica mais inteligente aqui se quiser
  console.log("Analisando token:", token.name || token.symbol);
  return true; // Por enquanto, comprar todos os tokens encontrados
}

function deveVender(tokenInfo) {
  const { currentPrice, buyPrice, timestamp } = tokenInfo;

  const lucroPercentual = ((currentPrice - buyPrice) / buyPrice) * 100;
  const tempoDecorridoHoras = (Date.now() - timestamp) / (1000 * 60 * 60);

  if (lucroPercentual >= PROFIT_TARGET_PERCENT) return true;
  if (lucroPercentual <= -STOP_LOSS_PERCENT) return true;
  if (tempoDecorridoHoras >= HOLD_HOURS_IF_POTENTIAL) return true;

  return false;
}
