function decidirCompraVenda(token) {
  const precoAtual = token.token_price;
  const targetProfit = precoAtual * 2;      // +100%
  const stopLoss = precoAtual * 0.85;       // -15%

  // Exemplo de heurística fictícia para detectar 5x/10x/100x
  if (token.potential && ["5x", "10x", "100x"].includes(token.potential)) {
    return "HOLD";
  }

  if (precoAtual >= targetProfit) return "SELL";
  if (precoAtual <= stopLoss) return "STOP";
  return "BUY";
}
