async function buscarTokensPumpFun() {
  try {
    const response = await fetch('https://solana-bot-backend.vercel.app/api/tokens');
    const tokens = await response.json();

    const tokensValidos = tokens
      .filter(token => token && token.name && token.mint && token.liquidity > 0)
      .map(token => ({
        name: token.name,
        address: token.mint,
        liquidity: token.liquidity,
        marketCap: token.marketCap || 0,
        createdAt: token.createdAt || Date.now()
      }));

    console.log(`✅ Tokens encontrados: ${tokensValidos.length}`);
    return tokensValidos.slice(0, 20);
  } catch (err) {
    console.error("❌ Erro ao buscar tokens:", err);
    return [];
  }
}
