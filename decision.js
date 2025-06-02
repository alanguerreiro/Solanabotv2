function decidirCompraVenda(token) {
  const precoAtual = token.price;
  const precoCompra = 5;
  const alvoLucro = precoCompra * 2; // +100%
  const stopLoss = precoCompra * 0.85; // -15%

  // Se o token tiver potencial de 5x, 10x ou 100x, segura por até 5 horas
  if (token.potential && [5, 10, 100].includes(token.potential)) {
    const agora = Date.now();
    const tempoDesdeCompra = agora - token.dataCompra;

    // Esperar até 5h (18000000 ms)
    if (tempoDesdeCompra < 18000000) {
      return "AGUARDAR";
    }
  }

  // Lógica de venda
  if (precoAtual >= alvoLucro) {
    return "VENDER";
  }

  if (precoAtual <= stopLoss) {
    return "STOP";
  }

  return "MANTER";
}
