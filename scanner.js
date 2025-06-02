// scanner.js — busca tokens do Pump.fun
async function buscarTokensPumpFun() {
  try {
    const res = await fetch("https://pump.fun/api/launchpad?sort=recent");
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("❌ Dados inesperados do Pump.fun");
      return [];
    }

    // Filtra tokens com liquidez
    const tokensValidos = data
      .filter(token => token && token.name && token.mint && token.liquidity > 0)
      .map(token => ({
        name: token.name,
        address: token.mint,
        liquidity: token.liquidity,
        marketCap: token.marketCap || 0,
        createdAt: token.createdAt || Date.now()
      }));

    console.log(`✅ ${tokensValidos.length} tokens encontrados`);
    return tokensValidos.slice(0, 20); // retorna os 20 mais recentes
  } catch (err) {
    console.error("❌ Erro ao buscar tokens do Pump.fun:", err);
    return [];
  }
}
