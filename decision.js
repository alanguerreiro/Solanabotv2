// decision.js

function avaliarCompra(token) {
  const BUY_AMOUNT_USDC = 5;
  const PROFIT_TARGET_PERCENT = 100;
  const STOP_LOSS_PERCENT = 15;
  const MAX_HOLD_TIME_MS = 5 * 60 * 60 * 1000; // 5 horas

  logToConsole(`📊 Avaliando token ${token.symbol} (${token.address})`);

  // Simula decisão de compra automática
  const shouldBuy = true; // Aqui pode inserir sua lógica extra se quiser

  if (shouldBuy) {
    logToConsole(`🟢 Decisão: Comprar $${BUY_AMOUNT_USDC} de ${token.symbol}`);
    
    realizarSwap(token.address, BUY_AMOUNT_USDC)
      .then((txId) => {
        logToConsole(`✅ Swap realizado com sucesso! TX: ${txId}`);

        monitorarLucroOuPrejuizo(token, BUY_AMOUNT_USDC, PROFIT_TARGET_PERCENT, STOP_LOSS_PERCENT, MAX_HOLD_TIME_MS);
      })
      .catch((err) => {
        logToConsole(`❌ Falha ao comprar ${token.symbol}: ${err.message}`);
      });
  } else {
    logToConsole(`🔴 Decisão: Ignorar ${token.symbol}`);
  }
}
