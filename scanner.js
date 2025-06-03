async function buscarTokens() {
  try {
    const response = await fetch("https://pump.fun/api/token/list");
    const data = await response.json();

    // Ordena pelos mais recentes
    const tokensOrdenados = data.slice(0, 20); // ajustável
    return tokensOrdenados.map(t => ({
      symbol: t.symbol,
      mint: t.mint,
      name: t.name,
      price: t.price,
    }));
  } catch (err) {
    console.error("Erro no scanner:", err);
    return [];
  }
}
